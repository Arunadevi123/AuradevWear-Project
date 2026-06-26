import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { performLogout } from "../redux/authSlice";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(performLogout()); // ✅ Clears auth + cart + localStorage
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <nav className="container mx-auto px-5 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-400 tracking-wide hover:text-indigo-300 transition"
        >
          AuradevWear
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {["Home", "About", "Products", "Contact"].map((item) => (
            <li key={item}>
              <Link
                to={`/${item === "Home" ? "" : item.toLowerCase()}`}
                className="text-gray-200 hover:text-indigo-400 transition"
              >
                {item}
              </Link>
            </li>
          ))}

          {/* Cart Icon */}
          <li className="relative">
            <Link to="/cart" className="text-gray-200 hover:text-indigo-400">
              <ShoppingCartIcon className="h-6 w-6" />
            </Link>
            {items.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5">
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </li>

          {/* User / Auth */}
          {user ? (
            <li className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="text-gray-200 hover:text-indigo-400 transition"
              >
                <UserCircleIcon className="h-6 w-6" />
              </button>

              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-48 bg-gray-800 rounded-lg shadow-lg p-3 text-center"
                >
                  <p className="text-gray-300 font-semibold mb-2">{user.name}</p>
                  <Link
                    to="/myorders"
                    onClick={() => setProfileOpen(false)}
                    className="block w-full bg-gray-700 text-white py-1.5 rounded-md mb-2 hover:bg-gray-600 transition"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-indigo-500 w-full text-white py-1.5 rounded-md hover:bg-indigo-600 transition"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </li>
          ) : (
            <>
              <li>
                <Link
                  to="/register"
                  className="text-gray-200 hover:text-indigo-400 transition"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="bg-indigo-500 px-3 py-1.5 rounded-md text-white hover:bg-indigo-600 transition"
                >
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-200 hover:text-indigo-400"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-gray-900 border-t border-gray-800 px-6 py-4 space-y-4 text-center"
        >
          {["Home", "About", "Products", "Contact"].map((item) => (
            <Link
              key={item}
              to={`/${item === "Home" ? "" : item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="block text-gray-200 hover:text-indigo-400 transition"
            >
              {item}
            </Link>
          ))}

          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-200 hover:text-indigo-400 transition"
          >
            Cart ({items.length})
          </Link>

          {user ? (
            <>
              <p className="text-gray-300 font-semibold">{user.name}</p>

              <Link
                to="/myorders"
                onClick={() => setMenuOpen(false)}
                className="block bg-gray-700 text-white py-1.5 rounded-md hover:bg-gray-600 transition"
              >
                My Orders
              </Link>

              <button
                onClick={handleLogout}
                className="w-full bg-indigo-500 text-white py-1.5 rounded-md hover:bg-indigo-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block text-gray-200 hover:text-indigo-400 transition"
              >
                Register
              </Link>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block bg-indigo-500 text-white py-1.5 rounded-md hover:bg-indigo-600 transition"
              >
                Login
              </Link>
            </>
          )}
        </motion.div>
      )}
    </header>
  );
};

export default Header;
