import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";

const Checkout = () => {
  const { items } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const orderTotal = items.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handlePlaceOrder = async () => {
    setLoading(true);
    setOrderError(null);

    try {
      const normalizedAddress = Object.fromEntries(
        Object.entries(shippingAddress).map(([key, value]) => [key, value.trim()])
      );

      const orderItems = items.map((item) => {
        const productId = Number(item.id || item._id);
        const price = Number(item.price);

        if (!Number.isInteger(productId) || productId <= 0) {
          throw new Error("Invalid product in cart. Please remove it and add it again.");
        }

        if (!Number.isFinite(price) || price < 0) {
          throw new Error("Invalid product price in cart. Please remove it and add it again.");
        }

        const quantity = Number(item.quantity);
        if (!Number.isInteger(quantity) || quantity <= 0) {
          throw new Error("Invalid product quantity in cart. Please remove it and add it again.");
        }

        const firstImage = Array.isArray(item.image) ? item.image[0] : item.image;
        const imageUrl = String(firstImage?.url || firstImage || "/placeholder.jpg");
        const image = imageUrl.length <= 255 ? imageUrl : "/placeholder.jpg";

        return {
          product: productId,
          name: item.name,
          qty: quantity,
          image,
          price,
        };
      });

      if (!Number.isFinite(orderTotal) || orderTotal <= 0) {
        throw new Error("Order total must be greater than zero.");
      }

      const { data } = await api.post(
        "/orders",
        {
          orderItems,
          shippingAddress: normalizedAddress,
          paymentMethod,
          itemsPrice: orderTotal,
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: orderTotal,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        dispatch(clearCart());
        navigate("/order/success", { state: { orderId: data.order._id || data.order.id } });
      }
    } catch (err) {
      console.error("Order creation failed:", err.response?.data || err.message);
      setOrderError(err.response?.data?.message || err.message || "Error creating order");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const isAddressValid = Object.values(shippingAddress).every(
    (value) => value.trim() !== ""
  );

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
        Secure Checkout
      </h1>
      {items.length === 0 ? (
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <p className="text-xl text-gray-600 mb-4">
            Your cart is empty.{" "}
            <a href="/products" className="text-blue-600 underline hover:text-blue-800">
              Continue Shopping
            </a>
          </p>
        </div>
      ) : (
        <>
          <div className="mb-8 flex justify-between text-sm text-gray-500">
            <span className="flex items-center">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">1</span>
              Cart
            </span>
            <span className="flex items-center">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">2</span>
              Shipping
            </span>
            <span className="flex items-center">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">3</span>
              Review
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
                Order Summary
              </h2>
              {items.map((item) => {
                const itemId = item._id || item.id;
                const imageUrl = item.image?.[0]?.url || item.image || "/placeholder.jpg";

                return (
                  <div
                    key={itemId}
                    className="flex items-center mb-6 border-b pb-4 last:border-b-0"
                  >
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md mr-4"
                      onError={(e) => {
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-gray-600">
                        ${Number(item.price || 0).toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: itemId,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                      >
                        +
                      </button>
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? dispatch(
                                updateQuantity({
                                  id: itemId,
                                  quantity: item.quantity - 1,
                                })
                              )
                            : dispatch(removeFromCart(itemId))
                        }
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                      >
                        -
                      </button>
                      <button
                        onClick={() => dispatch(removeFromCart(itemId))}
                        className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="mt-6 pt-4 border-t">
                <p className="text-xl font-bold text-gray-900">
                  Total: ${orderTotal.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
                Shipping & Payment
              </h2>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4 text-gray-700">Shipping Address</h3>
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={shippingAddress.address}
                  onChange={handleAddressChange}
                  className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State / Province"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                  className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="ZIP / Postal Code"
                  value={shippingAddress.postalCode}
                  onChange={handleAddressChange}
                  className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                  className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4 text-gray-700">Payment Method</h3>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Pay on Delivery">Pay on Delivery</option>
                </select>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={!isAddressValid || loading || items.length === 0}
                className={`w-full py-3 rounded-lg text-white font-semibold ${
                  loading || !isAddressValid
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 transition"
                }`}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
              {orderError && (
                <p className="mt-4 text-red-500 text-center">{orderError}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
