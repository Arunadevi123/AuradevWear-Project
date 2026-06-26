import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setCredentials } from '../redux/authSlice';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`${import.meta.env.VITE_API_URL}/users/register`, form);

      const loginRes = await api.post(`${import.meta.env.VITE_API_URL}/users/login`, {
        email: form.email,
        password: form.password,
      });

      const token = loginRes.data?.token;
      const user = loginRes.data?.user;

      if (token && user) {
        localStorage.setItem('token', token);
        dispatch(setCredentials({ user, token }));
      }

      toast.success('Account created successfully!', {
        position: 'top-right',
        autoClose: 1200,
        onClose: () => navigate('/'),
      });
      setForm({ name: '', email: '', password: '' });
    } catch (err) {
      console.error('Registration error:', err);
      const isExistingAccount = err.response?.status === 409;
      const message =
        err.response?.data?.message ||
        (isExistingAccount
          ? 'Email already registered. Redirecting to sign in.'
          : null) ||
        (err.response?.status >= 500
          ? 'Backend server is not running or API is failing'
          : null) ||
        (err.code === 'ERR_NETWORK' ? 'Cannot connect to backend server' : null) ||
        'Registration failed';

      toast.error(message, {
        position: 'top-right',
        autoClose: 2000,
        onClose: () => {
          if (isExistingAccount) {
            navigate('/login', { state: { email: form.email } });
          }
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 sm:p-6 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl flex w-full max-w-5xl overflow-hidden border border-gray-700/50"
      >
        {/* Left Side - Branding */}
        <div className="hidden lg:block w-1/2 p-10 bg-[linear-gradient(135deg,_#1e3a8a_0%,_#7c3aed_100%)] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10"></div>
          <h2 className="text-4xl font-bold mb-6 tracking-tight">Join Our Community</h2>
          <p className="text-lg leading-relaxed opacity-90">
            Create an account to explore exclusive offers and start your shopping journey.
          </p>
          <div className="mt-8">
            <p className="text-sm opacity-70">Join thousands of happy customers today.</p>
          </div>
        </div>
        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 space-y-8">
          <h1 className="text-3xl font-bold text-white text-center">Create Account</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 transition duration-300"
                required
              />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 transition duration-300"
                required
              />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 transition duration-300"
                required
              />
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition duration-300 font-semibold text-lg shadow-lg"
            >
              Create Account
            </motion.button>
          </form>
          <p className="text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-400 hover:text-indigo-300 transition duration-200">
              Sign in
            </a>
          </p>
        </div>
      </motion.div>
      <ToastContainer theme="dark" />
    </div>
  );
};

export default Register;
