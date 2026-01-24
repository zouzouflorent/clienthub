import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc
} from "firebase/firestore";

export default function Tickets({ clientId }) {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!clientId) return;

    const q = query(
      collection(db, "tickets"),
      where("clientId", "==", clientId)
    );

    const unsub = onSnapshot(q, (snap) => {
      setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [clientId]);

  const addTicket = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "tickets"), {
      title,
      status: "open",
      clientId,
      createdAt: Date.now()
    });
    setTitle("");
  };

  const closeTicket = async (id) => {
    await updateDoc(doc(db, "tickets", id), {
      status: "closed"
    });
  };

  return (
    <div>
      <h3>Tickets</h3>

      <form onSubmit={addTicket}>
        <input
          placeholder="Ticket title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button>Add</button>
      </form>

      <ul>
        {tickets.map(t => (
          <li key={t.id}>
            {t.title} - {t.status}
            {t.status === "open" && (
              <button onClick={() => closeTicket(t.id)}>Close</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
