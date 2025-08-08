import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";
import getAxiosClient from "../axios-instance";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndTodos = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return navigate("/");

        setUser(user);

        const axios = await getAxiosClient();
        const { data } = await axios.get("/todos");
        setTodos(data.todos || []);
      } catch (error) {
        console.error("Failed to load todos:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndTodos();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen p-6 bg-base-200">
      <div className="max-w-2xl mx-auto bg-base-100 shadow-xl p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Donezo ✅ Dashboard</h1>
          <button className="btn btn-error btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {user && (
          <p className="text-sm text-gray-500 mb-2">
            Logged in as: {user.email}
          </p>
        )}

        {loading ? (
          <p>Loading todos...</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between bg-base-300 px-4 py-2 rounded"
              >
                <span
                  className={todo.completed ? "line-through text-gray-400" : ""}
                >
                  {todo.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
