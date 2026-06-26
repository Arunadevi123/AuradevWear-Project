import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const MyOrders = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await api.get(`${import.meta.env.VITE_API_URL}/orders/myorders`);
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token, navigate]);

  const markAsDelivered = async (orderId) => {
    try {
      await api.put(`${import.meta.env.VITE_API_URL}/orders/${orderId}/deliver`);
      const { data } = await api.get(`${import.meta.env.VITE_API_URL}/orders/myorders`);
      setOrders(data.orders || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark as delivered');
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (orders.length === 0) return <div className="text-center py-8 text-gray-600">No orders found.</div>;

  return (
    <div className="bg-gray-50 py-8 px-4 min-h-screen">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-indigo-900">My Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white shadow-md rounded-xl p-4 cursor-pointer"
              onClick={() =>
                setExpandedOrder(expandedOrder === order._id ? null : order._id)
              }
            >
              <div className="flex justify-between items-center flex-wrap">
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    Order #{order._id.slice(-8)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Total: ₹{order.totalPrice.toFixed(2)}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      order.isDelivered ? 'text-green-600' : 'text-yellow-600'
                    }`}
                  >
                    Status: {order.isDelivered ? 'Delivered' : 'Pending'}
                  </p>
                </div>
                {user.role === 'admin' && !order.isDelivered && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation(); // prevent card toggle
                      markAsDelivered(order._id);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md text-sm"
                  >
                    Mark Delivered
                  </motion.button>
                )}
              </div>

              {/* Expandable details */}
              <AnimatePresence>
                {expandedOrder === order._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 border-t pt-4 space-y-2"
                  >
                    {order.orderItems.map((item) => (
                      <div
                        key={item.product}
                        className="flex justify-between text-sm text-gray-600"
                      >
                        <span>{item.name} x {item.qty}</span>
                        <span>₹{(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
