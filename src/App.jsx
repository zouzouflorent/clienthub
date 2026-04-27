import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Auth from "./components/Auth";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Clients from "./components/Clients";

export default function App() {
  const [user, setUser] = useState(undefined);
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null));
    return () => unsub();
  }, []);

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Auth />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        user={user}
        onLogout={() => signOut(auth)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {activePage === "dashboard" ? "Tableau de bord" : "Clients & Tickets"}
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
              {user.email[0].toUpperCase()}
            </div>
            <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {activePage === "dashboard" ? (
            <Dashboard uid={user.uid} onNavigate={setActivePage} />
          ) : (
            <Clients uid={user.uid} />
          )}
        </main>
      </div>
    </div>
  );
}
