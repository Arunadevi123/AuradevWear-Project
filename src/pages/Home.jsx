import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom"; // <-- Import Link
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/products");
        setProducts(res.data.products.slice(0, 6));
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Error fetching products. Ensure you are logged in as an admin."
        );
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading)
    return <div className="text-center py-12 animate-pulse">Loading...</div>;
  if (error)
    return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 transition-all duration-500">
      {/* Hero Section with Slider */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          effect="fade"
          className="h-[500px] md:h-[600px]"
        >
          {[
            {
              title: "Welcome to Auradevwear!",
              subtitle: "Discover the latest trends in fashion.",
              button: "Shop Now",
              bg:
                "https://images.unsplash.com/photo-1570857502809-08184874388e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2hvcHxlbnwwfHwwfHx8MA%3D%3D",
              btnClass: "bg-blue-600 text-white hover:bg-blue-700",
            },
            {
              title: "New Arrivals",
              subtitle: "Explore our latest collection.",
              button: "Discover Now",
              bg:
                "https://images.unsplash.com/photo-1487744480471-9ca1bca6fb7d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fHNob3B8ZW58MHx8MHx8fDA%3D",
              btnClass: "bg-blue-600 text-white hover:bg-blue-700",
            },
            {
              title: "Seasonal Sale",
              subtitle: "Up to 30% off this season!",
              button: "Shop Sale",
              bg:
                "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzN8fHNob3B8ZW58MHx8MHx8fDA%3D",
              btnClass: "bg-yellow-400 text-gray-900 hover:bg-yellow-500",
            },
            {
              title: "Featured Products",
              subtitle: "Check out our best sellers.",
              button: "View Now",
              bg:
                "https://images.unsplash.com/photo-1617286647344-95c86d56748a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODB8fHNob3B8ZW58MHx8MHx8fDA%3D",
              btnClass: "bg-green-600 text-white hover:bg-green-700",
            },
          ].map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.bg})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-center p-6">
                  <div className="animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-shadow">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl mb-6">{slide.subtitle}</p>
                    <Link
                      to="/products"
                      className={`px-6 py-3 rounded-lg transition transform hover:scale-105 ${slide.btnClass}`}
                    >
                      {slide.button}
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-gradient-to-r from-white-600 to-grey-700 text-black relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-bounce-slow text-indigo-900">
            Special Offers: 70% Off All Items!
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Limited time offer. Don’t miss out—shop now!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Fashion Deals",
                img: "https://images.unsplash.com/photo-1552810143-899ab18457ed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fHNob3AlMjBkZWFsc3xlbnwwfHwwfHx8MA%3D%3D",
                desc: "Get 70% off on all clothing.",
                link: "/products",
              },
              {
                title: "Accessory Sale",
                img: "https://images.unsplash.com/photo-1662289032144-3ed681fdd260?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fGFjY2Vzc29yaWVzJTIwZGVhbHN8ZW58MHx8MHx8fDA%3D",
                desc: "Save big on accessories today!",
                link: "/products?category=Accessories",
              },
            ].map((offer, idx) => (
              <div
                key={idx}
                className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg hover:shadow-xl transition"
              >
                <img
                  src={offer.img}
                  alt={offer.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <h3 className="text-xl font-semibold mt-4">{offer.title}</h3>
                <p className="text-red-900 mt-2">{offer.desc}</p>
                <Link
                  to={offer.link}
                  className="mt-4 inline-block bg-yellow-400 text-gray-900 px-5 py-2 rounded-lg hover:bg-yellow-500 transition"
                >
                  Shop Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-indigo-900">
          Featured Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Men's Fashion",
              image:
                "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=500&auto=format&fit=crop&q=60",
            },
            {
              title: "Women's Fashion",
              image:
                "https://images.unsplash.com/photo-1525562723836-dca67a71d5f1?w=500&auto=format&fit=crop&q=60",
            },
            {
              title: "Kids",
              image:
                "https://images.unsplash.com/photo-1756626287301-5c73d6139282?w=500&auto=format&fit=crop&q=60",
            },
          ].map((category, idx) => (
            <div
              key={idx}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2"
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  {category.title}
                </h3>
                <Link
                  to="/products"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Products */}
      <section className="py-12 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8 text-indigo-900">
          Top Selections
        </h2>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="text-center text-gray-600">
                No products available yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-500 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-400 via-gray-500 to-black">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl font-bold text-center mb-12 text-white tracking-tight"
          >
            What Our Customers Say
          </motion.h2>
          <Swiper
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-8"
          >
            {[
              {
                text: "Amazing quality and fast shipping! Highly recommend!",
                user: "John Doe",
              },
              {
                text: "Love the variety, excellent service!",
                user: "Jane Smith",
              },
              {
                text: "Great customer support and products!",
                user: "Mike Johnson",
              },
            ].map((t, i) => (
              <SwiperSlide key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                  className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700/50 h-full flex flex-col justify-between"
                >
                  <p className="text-gray-200 italic text-lg mb-6">
                    &quot;{t.text}&quot;
                  </p>
                  <p className="text-right font-semibold text-indigo-300">
                    - {t.user}
                  </p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
};

export default Home;
