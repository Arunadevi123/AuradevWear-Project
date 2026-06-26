import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [resetToken, setResetToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setResetToken('');
    try {
      const { data } = await api.post('/users/password/forgot', { email });
      setResetToken(data.resetToken || '');
      setSuccess(
        data.resetToken
          ? 'Reset token generated. Continue to set a new password.'
          : 'Reset link sent to your email! Check your inbox.'
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
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
        Forgot Password
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
      {resetToken && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => navigate(`/reset-password/${resetToken}`)}
          className="w-full mb-4 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Continue To Reset Password
        </motion.button>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div initial={{ x: -50 }} animate={{ x: 0 }} transition={{ delay: 0.1 }}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
          />
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-secondary text-white p-3 rounded-lg hover:from-secondary hover:to-primary transition duration-300"
        >
          Send Reset Link
        </motion.button>
      </form>
      <p className="text-center text-gray-600 mt-4">
        Remember your password? <a href="/login" className="text-primary hover:underline">Login</a>
      </p>
    </motion.div>
  );
};

export default ForgotPassword;
