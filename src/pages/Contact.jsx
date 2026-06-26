import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Contact = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { name: '', email: '', message: '' },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      message: Yup.string().required('Message is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setError('');
        await api.post('/contact', values);
        setSuccess(true);
        resetForm();
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Unable to send message. Please try again.');
      }
    },
  });

  return (
    <div className="bg-white py-12 text-gray-900">
      <div className="container mx-auto px-4 md:px-8">
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-indigo-900">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions or feedback? Reach out to us, and we&apos;ll get back to you as soon as possible!
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="max-w-lg mx-auto mb-16"
        >
          {success ? (
            <p className="text-indigo-300 text-center text-lg font-semibold">
              Message sent successfully!
            </p>
          ) : (
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {error && (
                <p className="text-red-500 text-center text-sm font-medium">{error}</p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  name="name"
                  placeholder="Enter your name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-4 bg-gray-100/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 transition duration-300 ${
                    formik.touched.name && formik.errors.name ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-4 bg-gray-100/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 transition duration-300 ${
                    formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder="Enter your message"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-4 bg-gray-100/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 transition duration-300 h-32 resize-y ${
                    formik.touched.message && formik.errors.message ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.message && formik.errors.message && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.message}</p>
                )}
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-indigo-500 text-white p-4 rounded-xl hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed transition duration-300 font-semibold shadow-lg"
              >
                {formik.isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default Contact;
