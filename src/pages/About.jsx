import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => (
  <div className="bg-white py-12 text-gray-900">
    <div className="container mx-auto px-4 md:px-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-indigo-900">
          About Auradevwear
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          At Auradevwear, we craft fresh, high-quality products that blend sustainability, style, and innovation to elevate your wardrobe.
        </p>
      </motion.section>

      {/* Mission Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-semibold text-gray-900">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We are committed to bringing freshness to your wardrobe with eco-friendly materials and timeless designs. Our mission is to create clothing that not only looks good but also feels good for the planet.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-indigo-500 text-white px-6 py-3 rounded-xl hover:bg-indigo-600 transition duration-300 font-semibold shadow-lg"
            >
              Shop Now
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            whileHover={{ scale: 1.03 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1560014728-5a0b73199f7b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzF8fGNvbXBhbnklMjB2aXNpb24lMjBpbiUyMGZhc2hpb258ZW58MHx8MHx8fDA%3D"
              alt="Sustainable fashion at Aurawear"
              className="w-full h-80 object-cover rounded-xl shadow-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            whileHover={{ scale: 1.03 }}
            className="order-last md:order-first"
          >
            <img
              src="https://images.unsplash.com/photo-1645937464657-4106e824fb15?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGNvbXBhnyUyB2aXNpb24lMjBpbiUyMGZhc2hpb258ZW58MHx8MHx8fDA%3D"
              alt="Aurawear design process"
              className="w-full h-80 object-cover rounded-xl shadow-lg"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-semibold text-gray-900">Our Vision</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We envision a world where fashion is sustainable, inclusive, and inspiring. Our designs reflect your unique style while prioritizing environmental responsibility.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  </div>
);

export default About;