import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import supabase from '/src/lib/supabase.js'

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState();
  const [isSessionChecked, setIsSessionChecked] = useState(false);

  useEffect(() => {
    // Check session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? null);
      setIsSessionChecked(true);
    });

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (!isSessionChecked) {
    return <div>Loading...</div>;
  }

  return session ? children : <Navigate to="/login" />;
}
