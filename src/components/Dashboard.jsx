import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Users, Ticket, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

export default function Dashboard({ uid, onNavigate }) {
  const [clients, setClients] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (!uid) return;
    const qc = query(collection(db, "clients"), where("uid", "==", uid));
    const qt = query(collection(db, "tickets"), where("uid", "==", uid));
    const u1 = onSnapshot(qc, (s) => setClients(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const u2 = onSnapshot(qt, (s) => setTickets(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => { u1(); u2(); };
  }, [uid]);

  const openTickets = tickets.filter((t) => t.status === "open");
  const closedTickets = tickets.filter((t) => t.status === "closed");
  const urgentTickets = tickets.filter((t) => t.priority === "urgent" && t.status === "open");

  const stats = [
    {
      label: "Clients",
      value: clients.length,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Tickets ouverts",
      value: openTickets.length,
      icon: Ticket,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Tickets fermés",
      value: closedTickets.length,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Tickets urgents",
      value: urgentTickets.length,
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  // 5 tickets ouverts les plus récents
  const recentTickets = [...openTickets]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  const priorityLabel = { urgent: "Urgent", normal: "Normal", low: "Faible" };
  const priorityStyle = {
    urgent: "bg-red-100 text-red-700",
    normal: "bg-yellow-100 text-yellow-700",
    low: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className={`${bg} p-3 rounded-lg`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tickets récents */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Tickets ouverts récents</h3>
          <button
            onClick={() => onNavigate("clients")}
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            Voir tout <ArrowRight size={14} />
          </button>
        </div>

        {recentTickets.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Aucun ticket ouvert.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentTickets.map((t) => {
              const client = clients.find((c) => c.id === t.clientId);
              return (
                <li key={t.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{t.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {client?.name ?? "Client inconnu"} ·{" "}
                      {new Date(t.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ml-3 ${
                    priorityStyle[t.priority] ?? priorityStyle.normal
                  }`}>
                    {priorityLabel[t.priority] ?? "Normal"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Clients récents */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Clients récents</h3>
          <button
            onClick={() => onNavigate("clients")}
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            Voir tout <ArrowRight size={14} />
          </button>
        </div>
        {clients.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Aucun client ajouté.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {[...clients]
              .sort((a, b) => b.createdAt - a.createdAt)
              .slice(0, 5)
              .map((c) => {
                const clientTickets = tickets.filter((t) => t.clientId === c.id && t.status === "open");
                return (
                  <li key={c.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-semibold shrink-0">
                        {c.name[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{c.name}</p>
                        <p className="text-xs text-gray-400 truncate">{c.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 shrink-0 ml-3">
                      {clientTickets.length} ticket{clientTickets.length !== 1 ? "s" : ""} ouvert{clientTickets.length !== 1 ? "s" : ""}
                    </span>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
}
