import { useEffect, useState } from "react";
import { db } from "../firebase"; 
import { collection, addDoc, onSnapshot, deleteDoc, doc, } from "firebase/firestore";
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
    <div>
      <h2>Clients</h2>

      <form onSubmit={addClient}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button>Add</button>
      </form>

      <ul>
        {clients.map((c) => (
          <li key={c.id}>
            <span onClick={() => setSelectedClient(c.id)}>
              {c.name} ({c.email})
            </span>
            <button onClick={() => deleteClient(c.id)}>❌</button>
          </li>
        ))}
        {selectedClient && <Tickets clientId={selectedClient} />}
      </ul>
    </div>
  );
}
