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

export default function Tickets({ clientId }) {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!clientId) return;

    const q = query(
      collection(db, "tickets"),
      where("clientId", "==", clientId),
    );

    const unsub = onSnapshot(q, (snap) => {
      setTickets(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [clientId]);

  const addTicket = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "tickets"), {
      title,
      status: "open",
      clientId,
      createdAt: Date.now(),
    });
    setTitle("");
  };

  const closeTicket = async (id) => {
    await updateDoc(doc(db, "tickets", id), {
      status: "closed",
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      <h3 className="text-lg font-semibold mb-4">Tickets</h3>

      <form onSubmit={addTicket} className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Ticket title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="bg-green-600 text-white px-4 rounded hover:bg-green-700">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {tickets.map((t) => (
          <li
            key={t.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>
              {t.title} –{" "}
              <span
                className={`text-sm ${
                  t.status === "open" ? "text-green-600" : "text-gray-500"
                }`}
              >
                {t.status}
              </span>
            </span>

            {t.status === "open" && (
              <button
                onClick={() => closeTicket(t.id)}
                className="text-sm text-blue-600 hover:underline"
              >
                Close
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
