import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { updateQuantity, removeFromCart } from '../redux/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const total = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const updateItemQuantity = (id, quantity) => {
    if (quantity < 1) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-md text-center bg-white p-8 rounded-2xl shadow-lg"
        >
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-6">Looks like you haven’t added any items yet.</p>
          <Link
            to="/products"
            className="bg-indigo-500 text-white py-2 px-6 rounded-lg hover:bg-indigo-600 transition duration-300"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Shopping Cart</h1>

        {/* Mobile: Card Layout */}
        <div className="space-y-4 md:hidden">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow p-4 flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <img
                  src={item.image?.[0]?.url || item.image || '/placeholder.jpg'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl"
                  onError={(e) => (e.target.src = '/placeholder.jpg')}
                />
                <div>
                  <h2 className="font-medium text-gray-800">{item.name}</h2>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition duration-200"
                >
                  -
                </motion.button>
                <span className="px-2 text-gray-800">{item.quantity}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300 transition duration-200"
                >
                  +
                </motion.button>
              </div>

              <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                <p className="text-gray-700 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Remove
                </motion.button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white rounded-2xl shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-gray-600 font-semibold">Product</th>
                <th className="p-4 text-gray-600 font-semibold">Price</th>
                <th className="p-4 text-gray-600 font-semibold">Quantity</th>
                <th className="p-4 text-gray-600 font-semibold">Total</th>
                <th className="p-4 text-gray-600 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50 transition duration-200">
                  <td className="p-4 flex items-center space-x-4">
                    <img
                      src={item.image?.[0]?.url || item.image || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl"
                      onError={(e) => (e.target.src = '/placeholder.jpg')}
                    />
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </td>
                  <td className="p-4 text-gray-700">${item.price.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="bg-gray-200 text-gray-800 px-2 py-1 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition duration-200"
                      >
                        -
                      </motion.button>
                      <span className="px-3 text-gray-800">{item.quantity}</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-300 transition duration-200"
                      >
                        +
                      </motion.button>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">${(item.price * item.quantity).toFixed(2)}</td>
                  <td className="p-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200"
                    >
                      Remove
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cart Summary */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <Link to="/products" className="text-indigo-600 underline hover:text-indigo-700">
            Continue Shopping
          </Link>
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-800">Total: ${total.toFixed(2)}</h2>
            <Link
              to="/checkout"
              className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Cart;
