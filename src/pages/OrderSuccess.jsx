import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!user || !token || !orderId) {
      navigate('/login');
    }
  }, [user, token, orderId, navigate]);

  return (
    <div className="bg-white py-8 px-4 text-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="container mx-auto max-w-4xl text-center"
      >
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        {orderId && (
          <p className="text-md text-gray-500 mb-6">
            Order ID: {orderId.slice(-8)} (Click below to view details)
          </p>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/myorders')}
          className="bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition"
        >
          View My Orders
        </motion.button>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;