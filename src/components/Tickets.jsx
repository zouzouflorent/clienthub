import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection, addDoc, onSnapshot,
  query, where, updateDoc, deleteDoc, doc,
} from "firebase/firestore";
import { Trash2, Plus, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

const PRIORITIES = [
  { value: "urgent", label: "Urgent", style: "bg-red-100 text-red-700", icon: AlertCircle },
  { value: "normal", label: "Normal", style: "bg-yellow-100 text-yellow-700", icon: Clock },
  { value: "low",    label: "Faible", style: "bg-gray-100 text-gray-600",   icon: CheckCircle2 },
];

function PriorityBadge({ priority }) {
  const p = PRIORITIES.find((x) => x.value === priority) ?? PRIORITIES[1];
  const Icon = p.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${p.style}`}>
      <Icon size={11} />
      {p.label}
    </span>
  );
}

export default function Tickets({ clientId, clientName, uid }) {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!clientId || !uid) return;
    setTickets([]); setError("");
    const q = query(
      collection(db, "tickets"),
      where("clientId", "==", clientId),
      where("uid", "==", uid)
    );
    const unsub = onSnapshot(q,
      (snap) => {
        const sorted = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => b.createdAt - a.createdAt);
        setTickets(sorted);
      },
      (err) => setError("Erreur de chargement : " + err.message)
    );
    return () => unsub();
  }, [clientId, uid]);

  const addTicket = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setError(""); setLoading(true);
    try {
      await addDoc(collection(db, "tickets"), {
        title: title.trim(),
        description: description.trim(),
        priority,
        status: "open",
        clientId, uid,
        createdAt: Date.now(),
      });
      setTitle(""); setDescription(""); setPriority("normal");
      setShowForm(false);
    } catch (err) {
      setError(err.code === "permission-denied"
        ? "Permissions insuffisantes. Verifiez les regles Firestore."
        : "Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (t) => {
    try {
      await updateDoc(doc(db, "tickets", t.id), {
        status: t.status === "open" ? "closed" : "open",
      });
    } catch (err) { setError("Erreur : " + err.message); }
  };

  const deleteTicket = async (id) => {
    try {
      await deleteDoc(doc(db, "tickets", id));
    } catch (err) { setError("Erreur : " + err.message); }
  };

  const openCount   = tickets.filter((t) => t.status === "open").length;
  const closedCount = tickets.filter((t) => t.status === "closed").length;

  const displayed = tickets.filter((t) => {
    if (filter === "open")   return t.status === "open";
    if (filter === "closed") return t.status === "closed";
    if (filter === "urgent") return t.priority === "urgent" && t.status === "open";
    return true;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">
            Tickets — <span className="text-blue-600">{clientName}</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {openCount} ouvert{openCount !== 1 ? "s" : ""} · {closedCount} ferme{closedCount !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Nouveau ticket
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <form onSubmit={addTicket} className="space-y-3">
            <input
              className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Titre du ticket *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
            <input
              className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description (optionnel)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                      priority === p.value
                        ? p.style + " border-transparent"
                        : "border-gray-200 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 font-medium"
                >
                  {loading ? "..." : "Enregistrer"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="mx-5 mt-3 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Filtres */}
      <div className="px-5 py-3 border-b border-gray-100 flex gap-2">
        {[
          { key: "all",    label: "Tous" },
          { key: "open",   label: "Ouverts" },
          { key: "closed", label: "Fermes" },
          { key: "urgent", label: "Urgents" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              filter === key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="flex-1 overflow-auto">
        {displayed.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">Aucun ticket.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {displayed.map((t) => (
              <li
                key={t.id}
                className={`flex items-start justify-between px-5 py-4 gap-4 hover:bg-gray-50 transition-colors ${
                  t.status === "closed" ? "opacity-50" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium text-gray-800 ${t.status === "closed" ? "line-through" : ""}`}>
                    {t.title}
                  </p>
                  {t.description && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{t.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(t.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <PriorityBadge priority={t.priority} />
                  <button
                    onClick={() => toggleStatus(t)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                      t.status === "open"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {t.status === "open" ? "Ouvert" : "Ferme"}
                  </button>
                  <button
                    onClick={() => deleteTicket(t.id)}
                    className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
