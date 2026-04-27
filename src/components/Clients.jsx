import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection, addDoc, onSnapshot,
  deleteDoc, doc, query, where,
} from "firebase/firestore";
import { Trash2, ChevronRight, Search, UserPlus } from "lucide-react";
import Tickets from "./Tickets";

export default function Clients({ uid }) {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, "clients"), where("uid", "==", uid));
    const unsub = onSnapshot(q, (snap) => {
      const sorted = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => b.createdAt - a.createdAt);
      setClients(sorted);
    });
    return () => unsub();
  }, [uid]);

  const addClient = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    await addDoc(collection(db, "clients"), {
      name, email, phone, uid, createdAt: Date.now(),
    });
    setName(""); setEmail(""); setPhone("");
    setShowForm(false);
  };

  const deleteClient = async (id) => {
    await deleteDoc(doc(db, "clients", id));
    if (selectedClient?.id === id) setSelectedClient(null);
  };

  const selectClient = (client) => {
    setSelectedClient((prev) => (prev?.id === client.id ? null : client));
  };

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search))
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche : liste clients */}
        <div className="lg:col-span-1 space-y-4">
          {/* Barre de recherche + bouton ajouter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full border border-gray-300 pl-9 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Rechercher un client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shrink-0"
            >
              <UserPlus size={16} />
              Ajouter
            </button>
          </div>

          {/* Formulaire d'ajout (collapsible) */}
          {showForm && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Nouveau client</h3>
              <form onSubmit={addClient} className="space-y-2.5">
                <input
                  className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom complet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Telephone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Liste */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Clients</h2>
              <span className="text-xs text-gray-400">{clients.length} au total</span>
            </div>
            {filtered.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                {search ? "Aucun résultat." : "Aucun client pour l'instant."}
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {filtered.map((c) => (
                  <li
                    key={c.id}
                    onClick={() => selectClient(c)}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                      selectedClient?.id === c.id
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-semibold shrink-0">
                        {c.name[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{c.name}</p>
                        <p className="text-xs text-gray-400 truncate">{c.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <ChevronRight
                        size={15}
                        className={`text-blue-400 transition-transform ${
                          selectedClient?.id === c.id ? "rotate-90" : ""
                        }`}
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteClient(c.id); }}
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

        {/* Colonne droite : tickets */}
        <div className="lg:col-span-2">
          {selectedClient ? (
            <Tickets
              clientId={selectedClient.id}
              clientName={selectedClient.name}
              uid={uid}
            />
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <ChevronRight size={22} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Sélectionnez un client</p>
              <p className="text-gray-400 text-sm mt-1">pour voir et gérer ses tickets</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
