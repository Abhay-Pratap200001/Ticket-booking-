import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// top navigation bar showing app name and login state
const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  // logs the user out and sends them back to the login page
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold">
        <span className="bg-white/20 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4Z" />
          </svg>
        </span>
        Ticket Booking
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium hover:underline">
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium border border-white/60 hover:bg-white/15 px-4 py-2 rounded-lg"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
