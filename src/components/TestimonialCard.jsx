import { motion } from 'framer-motion';

const TestimonialCard = ({ testimonial }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
    className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 mx-2 shadow-lg border border-gray-700/50 h-full flex flex-col justify-between"
  >
    <p className="text-gray-200 italic text-lg mb-6">&quot;{testimonial.text}&quot;</p>
    <p className="text-right font-semibold text-indigo-300">- {testimonial.user}</p>
  </motion.div>
);

export default TestimonialCard;