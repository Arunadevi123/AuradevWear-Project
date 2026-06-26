import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, removeFromCart, updateQuantity } from '../redux/cartSlice';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item.id === (product?.id || product?._id))
  );

  // Extract image URL - handle both string and object formats
  const getImageUrl = () => {
    if (!product?.image) return '/placeholder.jpg';
    
    // If image is an array
    if (Array.isArray(product.image) && product.image.length > 0) {
      const firstImage = product.image[0];
      
      // If it's a string
      if (typeof firstImage === 'string') {
        return firstImage;
      }
      
      // If it's an object with url property
      if (firstImage?.url) {
        return firstImage.url;
      }
    }
    
    return '/placeholder.jpg';
  };

  const imageUrl = getImageUrl();
  const productName = product?.name || 'Unnamed Product';
  const productPrice = product?.price ? parseFloat(product.price).toFixed(2) : '0.00';
  const productId = product?.id || product?._id || 'unknown';
  const productRating = Math.round(product?.ratings || 0);
  const quantity = cartItem?.quantity || 0;
  const hasStockLimit = typeof product?.stock === 'number';

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, id: productId }));
    toast.success('Successfully Added the Cart', {
      position: 'top-center',
      theme: 'light',
      style: { color: '#2563eb', fontWeight: 600 },
    });
  };

  const handleDecreaseQuantity = () => {
    if (quantity <= 1) {
      dispatch(removeFromCart(productId));
      return;
    }

    dispatch(updateQuantity({ id: productId, quantity: quantity - 1 }));
  };

  const handleIncreaseQuantity = () => {
    if (hasStockLimit && quantity >= product.stock) {
      toast.info('No more stock available');
      return;
    }

    dispatch(updateQuantity({ id: productId, quantity: quantity + 1 }));
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
      <Link to={`/products/product/${productId}`} className="block relative">
        {/* Image Container */}
        <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              console.warn(`Image failed to load: ${imageUrl}`);
              e.target.src = '/placeholder.jpg';
            }}
          />
          {product?.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate mb-2">
            {productName}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < productRating ? 'fill-current' : 'text-gray-300'}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.5 3 1.5-5.5L2 7.5l5.5-.5L10 2l2.5 5 5.5.5-4 4 1.5 5.5z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              ({product?.numberOfReviews || 0})
            </span>
          </div>

          {/* Price */}
          <p className="text-xl font-bold text-indigo-600 mb-3">${productPrice}</p>

          {/* Stock Info */}
          <p className={`text-sm mb-3 ${product?.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product?.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
          </p>
        </div>
      </Link>

      {quantity > 0 ? (
        <div className="flex w-full items-center justify-between bg-indigo-600 text-white">
          <button
            type="button"
            onClick={handleDecreaseQuantity}
            className="w-14 py-2 text-2xl font-semibold hover:bg-indigo-700 transition-colors"
            aria-label={`Decrease ${productName} quantity`}
          >
            -
          </button>
          <span className="py-2 text-lg font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={handleIncreaseQuantity}
            className="w-14 py-2 text-2xl font-semibold hover:bg-indigo-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            disabled={hasStockLimit && quantity >= product.stock}
            aria-label={`Increase ${productName} quantity`}
          >
            +
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full py-2 px-4 font-medium transition-colors ${
            product?.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
          disabled={product?.stock === 0}
        >
          {product?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      )}
    </div>
  );
};

export default ProductCard;
