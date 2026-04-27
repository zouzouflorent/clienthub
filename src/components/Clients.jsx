import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { Trash2, ChevronRight } from "lucide-react";
import Tickets from "./Tickets";

export default function Clients({ uid }) {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  // Fetch clients filtrés par uid
  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, "clients"), where("uid", "==", uid));
    const unsub = onSnapshot(q, (snap) => {
      setClients(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [uid]);

  const addClient = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    await addDoc(collection(db, "clients"), {
      name,
      email,
      phone,
      uid,
      createdAt: Date.now(),
    });
    setName("");
    setEmail("");
    setPhone("");
  };

  const deleteClient = async (id) => {
    await deleteDoc(doc(db, "clients", id));
    if (selectedClient?.id === id) setSelectedClient(null);
  };

  const selectClient = (client) => {
    setSelectedClient((prev) => (prev?.id === client.id ? null : client));
  };

  return (
    <div className="space-y-6">
      {/* Ligne du haut : Add + List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Client */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Ajouter un client</h2>
          <form onSubmit={addClient} className="space-y-3">
            <input
              className="border border-gray-300 p-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="border border-gray-300 p-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="border border-gray-300 p-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white w-full py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Ajouter le client
            </button>
          </form>
        </div>

        {/* Clients List */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Liste des clients</h2>
          {clients.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucun client pour l'instant.</p>
          ) : (
            <ul className="space-y-2">
              {clients.map((c) => (
                <li
                  key={c.id}
                  onClick={() => selectClient(c)}
                  className={`flex justify-between items-center border p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedClient?.id === c.id
                      ? "bg-blue-50 border-blue-300"
                      : "hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <ChevronRight
                      size={16}
                      className={`shrink-0 transition-transform text-blue-500 ${
                        selectedClient?.id === c.id ? "rotate-90" : ""
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">{c.name}</p>
                      <p className="text-xs text-gray-400 truncate">{c.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteClient(c.id);
                    }}
                    className="text-red-400 hover:text-red-600 transition-colors shrink-0 ml-2"
                    aria-label="Supprimer le client"
                  >
                    <Trash2 size={17} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Tickets — pleine largeur, toujours visible si client sélectionné */}
      {selectedClient && (
        <Tickets
          clientId={selectedClient.id}
          clientName={selectedClient.name}
          uid={uid}
        />
      )}
    </div>
  );
}
