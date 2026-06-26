import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from "../utils/api";
import { motion } from 'framer-motion';
import { addToCart } from '../redux/cartSlice';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newReview, setNewReview] = useState({ name: '', rating: 0, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const sizes = ['S', 'M', 'L', 'XL'];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`${import.meta.env.VITE_API_URL}/products/product/${id}`);
        if (!res.data.success) {
          throw new Error(res.data.message || 'Product not found');
        }
        setProduct(res.data.product);
        setSelectedSize(sizes[0] || '');
        setNewReview((prev) => ({ ...prev, name: user?.name || '' }));

        const similarRes = await api.get(`${import.meta.env.VITE_API_URL}/products/products`, {
          params: { category: res.data.product.category, page: 1, notId: id, limit: 4 },
        });
        setSimilarProducts(similarRes.data.success ? similarRes.data.products || [] : []);

        if (user && token) {
          const purchaseCheck = await api.get(`${import.meta.env.VITE_API_URL}/orders/check-product-purchase/${id}`);
          setCanReview(Boolean(purchaseCheck.data.success));
        } else {
          setCanReview(false);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            (err.response?.status === 404 ? 'Product not found' : 'Error fetching product details')
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, user, token]);

  const handlePrevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? (product?.image?.length || 1) - 1 : prev - 1));
  const handleNextImage = () => setCurrentImageIndex((prev) => (prev === (product?.image?.length || 1) - 1 ? 0 : prev + 1));

  // Get image URL from product.image array
  const getCurrentImageUrl = () => {
    if (!product?.image || product.image.length === 0) {
      return '/placeholder.jpg';
    }
    
    const currentImage = product.image[currentImageIndex];
    
    if (typeof currentImage === 'string') {
      return currentImage;
    }
    
    if (currentImage?.url) {
      return currentImage.url;
    }
    
    return '/placeholder.jpg';
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.rating || !newReview.comment) {
      alert('Please fill out all review fields');
      return;
    }
    try {
      const res = await api.post(
        `${import.meta.env.VITE_API_URL}/products/product/${id}/reviews`,
        { ...newReview, rating: Number(newReview.rating) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setProduct((prev) => ({
          ...prev,
          reviews: [...(prev.reviews || []), res.data.review],
          numberOfReviews: (prev.numberOfReviews || 0) + 1,
        }));
        setNewReview({ name: user?.name || '', rating: 0, comment: '' });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    dispatch(addToCart({ ...product, id: product._id }));
    toast.success('Successfully Added the Cart', {
      position: 'top-center',
      theme: 'light',
      style: { color: '#2563eb', fontWeight: 600 },
    });
    navigate('/cart');
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    dispatch(addToCart({ ...product, id: product._id }));
    toast.success('Successfully Added to Cart');
    navigate('/checkout');
  };

  if (loading) return <div className="text-center py-8 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-8 text-gray-600">Product not found</div>;

  return (
    <div className="bg-white py-8 px-4 text-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="container mx-auto max-w-7xl"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <div className="relative">
              <img
                src={getCurrentImageUrl()}
                alt={product.name}
                className="w-full h-[400px] object-cover rounded-xl shadow-md bg-gray-200"
                onError={(e) => {
                  console.warn('Image failed to load:', getCurrentImageUrl());
                  e.target.src = '/placeholder.jpg';
                }}
              />
              {product.image?.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                  >
                    {'<'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                  >
                    {'>'}
                  </motion.button>
                  <div className="flex gap-2 mt-4 justify-center flex-wrap">
                    {product.image.map((img, index) => {
                      const thumbUrl = typeof img === 'string' ? img : (img?.url || '/placeholder.jpg');
                      return (
                        <img
                          key={index}
                          src={thumbUrl}
                          alt={`Thumbnail ${index + 1}`}
                          className={`w-16 h-16 object-cover rounded-md cursor-pointer transition-all hover:scale-110 ${
                            currentImageIndex === index ? 'border-2 border-indigo-500' : 'border border-gray-300'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                          onError={(e) => (e.target.src = '/placeholder.jpg')}
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="lg:w-1/2">
            <h1 className="text-3xl font-bold mb-3 text-indigo-300">{product.name}</h1>
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(product.ratings || 0) ? 'fill-current' : 'text-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.5 3 1.5-5.5L2 7.5l5.5-.5L10 2l2.5 5 5.5.5-4 4 1.5 5.5z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-600">({product.numberOfReviews || 0} reviews)</span>
            </div>
            <p className="text-2xl font-semibold mb-4 text-indigo-300">${product.price.toFixed(2)}</p>
            <p className="text-gray-700 mb-6">{product.description || 'No description available'}</p>
            <div className="mb-6">
              <p className="text-gray-600 mb-2 font-medium">Select Size:</p>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl border ${
                      selectedSize === size
                        ? 'bg-indigo-500 text-white border-indigo-500'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } ${product.stock === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                    disabled={product.stock === 0}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-4">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
            <div className="flex gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-3 rounded-xl text-white font-medium ${
                  product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'
                }`}
              >
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className={`flex-1 py-3 rounded-xl text-white font-medium ${
                  product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Buy Now
              </motion.button>
            </div>
            <div className="text-gray-600">
              <p>Category: {product.category}</p>
              <p>Color: {product.color || 'N/A'}</p>
              <p>Material: {product.material || 'N/A'}</p>
              <p>Type: {product.type || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-indigo-300">Customer Reviews</h2>
          {product.reviews?.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-md mb-4">
                <div className="flex items-center mb-2">
                  <p className="font-bold text-gray-900">{review.name}</p>
                  <div className="flex ml-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.5 3 1.5-5.5L2 7.5l5.5-.5L10 2l2.5 5 5.5.5-4 4 1.5 5.5z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          )}
          {user && canReview && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-indigo-300">Write a Review</h3>
              <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-xl shadow-md">
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={user?.name || newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="w-full p-2 bg-gray-100/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    placeholder="Your name"
                    required
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">Rating</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                    className="w-full p-2 bg-gray-100/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    required
                  >
                    <option value="0">Select rating</option>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r} Star{r > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">Comment</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full p-2 bg-gray-100/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    rows="4"
                    placeholder="Your review"
                    required
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600"
                >
                  Submit Review
                </motion.button>
              </form>
            </div>
          )}
          {!user && (
            <p className="mt-4 text-gray-600">
              Please <Link to="/login" className="text-indigo-500 underline hover:text-indigo-600">log in</Link> to review this product.
            </p>
          )}
          {user && !canReview && (
            <p className="mt-4 text-gray-600">You can review this product after purchasing it.</p>
          )}
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-indigo-300">You May Also Like</h2>
          {similarProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No similar products found.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
