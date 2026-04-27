import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const ERROR_MESSAGES = {
  "auth/invalid-email": "Adresse email invalide.",
  "auth/user-not-found": "Aucun compte trouvé avec cet email.",
  "auth/wrong-password": "Mot de passe incorrect.",
  "auth/email-already-in-use": "Cet email est déjà utilisé.",
  "auth/weak-password": "Le mot de passe doit contenir au moins 6 caractères.",
  "auth/too-many-requests": "Trop de tentatives. Réessayez plus tard.",
  "auth/invalid-credential": "Email ou mot de passe incorrect.",
};

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        {/* Logo / Titre */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">ClientHub</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isRegister ? "Créez votre compte" : "Connectez-vous à votre compte"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="vous@exemple.com"
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Message d'erreur inline */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg">
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Chargement..." : isRegister ? "Créer le compte" : "Se connecter"}
          </button>
        </form>

        <p
          onClick={switchMode}
          className="text-sm text-center text-blue-600 mt-5 cursor-pointer hover:underline"
        >
          {isRegister
            ? "Déjà un compte ? Se connecter"
            : "Pas de compte ? S'inscrire"}
        </p>
      </div>
    </div>
  );
}
