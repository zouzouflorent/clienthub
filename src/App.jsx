import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase"; 
import Auth from "./components/Auth";
import Clients from "./components/Clients";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  if (!user) return <Auth onLogin={() => setUser(auth.currentUser)} />;

  return (
    <div>
      <h1>ClientHub Dashboard</h1>
      <p>{user.email}</p>
      <button onClick={() => signOut(auth)}>Logout</button>
      <Clients />
    </div>
  );
}
