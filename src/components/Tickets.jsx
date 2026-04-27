import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function Tickets({ clientId, uid }) {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clientId || !uid) return;

    const q = query(
      collection(db, "tickets"),
      where("clientId", "==", clientId),
      where("uid", "==", uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      setTickets(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (err) => {
      setError("Erreur de chargement : " + err.message);
    });

    return () => unsub();
  }, [clientId, uid]);

  const addTicket = async (e) => {
    e.preventDefault();
    if (!title.trim() || !clientId || !uid) return;
    setError("");
    setLoading(true);
    try {
      await addDoc(collection(db, "tickets"), {
        title,
        status: "open",
        clientId,
        uid,
        createdAt: Date.now(),
      });
      setTitle("");
    } catch (err) {
      setError("Erreur : " + (err.code === "permission-denied"
        ? "Permissions insuffisantes. Vérifiez les règles Firestore."
        : err.message));
    } finally {
      setLoading(false);
    }
  };

  const closeTicket = async (id) => {
    try {
      await updateDoc(doc(db, "tickets", id), { status: "closed" });
    } catch (err) {
      setError("Erreur fermeture ticket : " + err.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      <h3 className="text-lg font-semibold mb-4">Tickets</h3>

      <form onSubmit={addTicket} className="flex gap-2 mb-3">
        <input
          className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Titre du ticket"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 rounded-lg hover:bg-green-700 disabled:opacity-60 whitespace-nowrap"
        >
          {loading ? "..." : "Ajouter"}
        </button>
      </form>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg mb-3">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {tickets.length === 0 ? (
        <p className="text-gray-400 text-sm">Aucun ticket pour ce client.</p>
      ) : (
        <ul className="space-y-2">
          {tickets.map((t) => (
            <li
              key={t.id}
              className="flex justify-between items-center border p-2 rounded-lg"
            >
              <span className="text-gray-700">
                {t.title}{" "}
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    t.status === "open"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {t.status === "open" ? "Ouvert" : "Fermé"}
                </span>
              </span>

              {t.status === "open" && (
                <button
                  onClick={() => closeTicket(t.id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Fermer
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
