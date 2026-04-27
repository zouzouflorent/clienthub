import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Trash2 } from "lucide-react";

export default function Tickets({ clientId, clientName, uid }) {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clientId || !uid) return;
    setTickets([]);
    setError("");

    const q = query(
      collection(db, "tickets"),
      where("clientId", "==", clientId),
      where("uid", "==", uid)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const sorted = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => b.createdAt - a.createdAt);
        setTickets(sorted);
      },
      (err) => {
        setError("Erreur de chargement : " + err.message);
      }
    );

    return () => unsub();
  }, [clientId, uid]);

  const addTicket = async (e) => {
    e.preventDefault();
    if (!title.trim() || !clientId || !uid) return;
    setError("");
    setLoading(true);
    try {
      await addDoc(collection(db, "tickets"), {
        title: title.trim(),
        description: description.trim(),
        status: "open",
        clientId,
        uid,
        createdAt: Date.now(),
      });
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(
        err.code === "permission-denied"
          ? "Permissions insuffisantes. Vérifiez les règles Firestore."
          : "Erreur : " + err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (t) => {
    try {
      await updateDoc(doc(db, "tickets", t.id), {
        status: t.status === "open" ? "closed" : "open",
      });
    } catch (err) {
      setError("Erreur mise à jour : " + err.message);
    }
  };

  const deleteTicket = async (id) => {
    try {
      await deleteDoc(doc(db, "tickets", id));
    } catch (err) {
      setError("Erreur suppression : " + err.message);
    }
  };

  const openCount = tickets.filter((t) => t.status === "open").length;
  const closedCount = tickets.filter((t) => t.status === "closed").length;

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Tickets — <span className="text-blue-600">{clientName}</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {openCount} ouvert{openCount !== 1 ? "s" : ""} · {closedCount} fermé{closedCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      <form onSubmit={addTicket} className="space-y-2 mb-4">
        <div className="flex gap-2">
          <input
            className="border border-gray-300 p-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Titre du ticket *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700 disabled:opacity-60 whitespace-nowrap font-medium transition-colors"
          >
            {loading ? "..." : "Ajouter"}
          </button>
        </div>
        <input
          className="border border-gray-300 p-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          placeholder="Description (optionnel)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </form>

      {/* Erreur */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg mb-3">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Liste des tickets */}
      {tickets.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">
          Aucun ticket pour ce client.
        </p>
      ) : (
        <ul className="space-y-2">
          {tickets.map((t) => (
            <li
              key={t.id}
              className={`flex justify-between items-start border p-3 rounded-lg gap-3 ${
                t.status === "closed" ? "opacity-60 bg-gray-50" : "bg-white"
              }`}
            >
              <div className="min-w-0 flex-1">
                <p
                  className={`font-medium text-gray-800 ${
                    t.status === "closed" ? "line-through" : ""
                  }`}
                >
                  {t.title}
                </p>
                {t.description && (
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {t.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(t.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Badge statut cliquable */}
                <button
                  onClick={() => toggleStatus(t)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                    t.status === "open"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {t.status === "open" ? "Ouvert" : "Fermé"}
                </button>

                {/* Supprimer */}
                <button
                  onClick={() => deleteTicket(t.id)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                  aria-label="Supprimer le ticket"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
