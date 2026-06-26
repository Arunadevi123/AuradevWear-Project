import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      await api.post(`${import.meta.env.VITE_API_URL}/users/reset/${token}`, { password: form.password }); // /api/v1/users/reset/:token
      setSuccess('Password reset successful! Login to continue.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/90 backdrop-blur-md rounded-lg shadow-2xl p-8 max-w-md w-full"
    >
      <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-6">
        Reset Password
      </h1>
      {success && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-500 text-center mb-4">
          {success}
        </motion.p>
      )}
      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-center mb-4">
          {error}
        </motion.p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div initial={{ x: -50 }} animate={{ x: 0 }} transition={{ delay: 0.1 }}>
          <input
            name="password"
            type="password"
            placeholder="New Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
          />
        </motion.div>
        <motion.div initial={{ x: -50 }} animate={{ x: 0 }} transition={{ delay: 0.2 }}>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
          />
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-secondary text-white p-3 rounded-lg hover:from-secondary hover:to-primary transition duration-300"
        >
          Reset Password
        </motion.button>
      </form>
      <p className="text-center text-gray-600 mt-4">
        <a href="/login" className="text-primary hover:underline">Back to Login</a>
      </p>
    </motion.div>
  );
};

export default ResetPassword;