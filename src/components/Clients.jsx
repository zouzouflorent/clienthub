import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Trash2 } from "lucide-react";
import Tickets from "./Tickets";

export default function Clients({ uid }) {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  // fetch clients
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "clients"), (snap) => {
      setClients(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Add client
  const addClient = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone) return;

    await addDoc(collection(db, "clients"), {
      name,
      email,
      phone,
      createdAt: Date.now(),
    });

    setName("");
    setEmail("");
    setPhone("");
  };

  // Delete client
  const deleteClient = async (id) => {
    await deleteDoc(doc(db, "clients", id));
    if (selectedClient === id) setSelectedClient(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Add Client */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Add Client</h2>

        <form onSubmit={addClient} className="space-y-3">
          <input
            className="border p-2 rounded w-full"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            Add Client
          </button>
        </form>
      </div>

      {/* Clients List */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Clients List</h2>

        <ul className="space-y-2">
          {clients.length === 0 && (
            <li className="text-gray-500 text-sm">No clients yet</li>
          )}

          {clients.map((c) => (
            <li
              key={c.id}
              className={`flex justify-between items-center border p-2 rounded cursor-pointer ${
                selectedClient === c.id ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <span
                onClick={() => setSelectedClient(c.id)}
                className="text-gray-700"
              >
                {c.name}
              </span>

              <button
                onClick={() => deleteClient(c.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
                aria-label="Delete client"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tickets */}
      {selectedClient && (
        <div className="md:col-span-2">
          <Tickets clientId={selectedClient} uid={uid} />
        </div>
      )}
    </div>
  );
}
