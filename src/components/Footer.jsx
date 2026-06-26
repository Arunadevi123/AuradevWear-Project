import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom"; // cdImport Link

const Footer = () => (
  <footer className="bg-gray-900 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black text-white py-12 relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10"></div>
    <div className="container mx-auto px-4 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4"
        >
          <h3 className="text-2xl font-bold tracking-tight">Auradevwear</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Discover exclusive collections and elevate your shopping experience with us.
          </p>
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="space-y-4"
        >
          <h4 className="text-lg font-semibold text-indigo-300">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/about"
                className="hover:text-indigo-400 transition duration-200"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="hover:text-indigo-400 transition duration-200"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-indigo-400 transition duration-200"
              >
                Contact
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="space-y-4"
        >
          <h4 className="text-lg font-semibold text-indigo-300">
            Connect With Us
          </h4>
          <div className="flex justify-center md:justify-start space-x-4">
            <motion.a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 5 }}
              className="text-gray-300 hover:text-indigo-400 transition duration-200"
            >
              <FaFacebookF size={24} />
            </motion.a>
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 5 }}
              className="text-gray-300 hover:text-indigo-400 transition duration-200"
            >
              <FaInstagram size={24} />
            </motion.a>
            <motion.a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 5 }}
              className="text-gray-300 hover:text-indigo-400 transition duration-200"
            >
              <FaTwitter size={24} />
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Copyright */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        className="mt-12 pt-8 border-t border-gray-700/50 text-center text-sm text-gray-400"
      >
        <p>&copy; 2025 Auradevwear. All rights reserved.</p>
      </motion.div>
    </div>
  </footer>
);

export default Footer;
