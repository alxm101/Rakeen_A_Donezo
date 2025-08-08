import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import supabase from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else navigate("/todos");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="bg-base-100 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Login to Donezo</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="input input-bordered w-full"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input input-bordered w-full"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="btn btn-primary w-full">Login</button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don&apos;t have an account? <Link to="/signup" className="text-blue-500 underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
