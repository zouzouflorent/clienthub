import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Tickets from "./Tickets";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "clients"), (snap) => {
      setClients(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const addClient = async (e) => {
    e.preventDefault();
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

  const deleteClient = async (id) => {
    await deleteDoc(doc(db, "clients", id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Form */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Add Client</h2>

        <form onSubmit={addClient} className="space-y-3">
          <input className="border p-2 rounded w-full" placeholder="Name" />
          <input className="border p-2 rounded w-full" placeholder="Email" />
          <input className="border p-2 rounded w-full" placeholder="Phone" />
          <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
            Add Client
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Clients List</h2>

        <ul className="space-y-2">
          {clients.map((c) => (
            <li
              key={c.id}
              className="flex justify-between items-center border p-2 rounded hover:bg-gray-50"
            >
              <span
                onClick={() => setSelectedClient(c.id)}
                className="cursor-pointer text-gray-700"
              >
                {c.name}
              </span>

              <button
                onClick={() => deleteClient(c.id)}
                className="text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedClient && (
        <div className="md:col-span-2">
          <Tickets clientId={selectedClient} />
        </div>
      )}
    </div>
  );
}
