import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { theme } from "../../styles/theme";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav
      className="flex justify-between items-center p-4 shadow-md"
      style={{ background: theme.colors.parchment }}
    >
      <Link to="/" className="text-2xl font-bold" style={{ color: theme.colors.red }}>
        OP CardXChange
      </Link>

      <div className="flex gap-6">
        <Link to="/wishlist" className="hover:underline">Wishlist</Link>

        {user ? (
          <>
            <Link to="/sell" className="px-4 py-2 rounded bg-blue-500 text-white">
              Sell
            </Link>
            <button onClick={logout} className="px-4 py-2 rounded bg-red-500 text-white">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded bg-red-600 text-white"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
