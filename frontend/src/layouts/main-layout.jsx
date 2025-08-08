import { Link, Outlet, useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";

export default function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link to="/todos" className="btn btn-ghost text-xl">
            Donezo
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <button className="btn btn-link" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
}
