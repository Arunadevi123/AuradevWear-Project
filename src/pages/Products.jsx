import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState("");

  const categories = ["All", "Men", "Women", "Kids", "Accessories"];
  const sortOptions = [
    { value: "", label: "Relevance" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "ratings", label: "Top Rated" },
  ];

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "All");
    setCurrentPage(1);
  }, [searchParams]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value || "");
      setCurrentPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("page", currentPage.toString());
        if (searchTerm.trim()) queryParams.append("keyword", searchTerm.trim());
        if (selectedCategory !== "All")
          queryParams.append("category", selectedCategory);
        if (sortOption) queryParams.append("sort", sortOption);

        const res = await api.get(`${import.meta.env.VITE_API_URL}/products/products?${queryParams.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products || []);
          setTotalPages(res.data.totalPages || Math.ceil((res.data.total || 10) / 10) || 1);
        } else {
          setError(res.data.message || "Failed to fetch products");
          setProducts([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("❌ Fetch error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Error fetching products");
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory, sortOption]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    debouncedSearch.cancel();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-indigo-900">
        Shop Our Products
      </h1>

      {/* Search, Filter, and Sort UI */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Search Bar */}
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search products (e.g., red)..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
            >
              ×
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-wrap justify-center sm:justify-start">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results and Products */}
      {loading ? (
        <div className="text-center py-12" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : products.length > 0 ? (
        <>
          <p className="mb-4 text-gray-600 text-center sm:text-left">
            Showing {products.length} of {products.length === 10 ? "10+" : products.length} products{" "}
            {searchTerm ? `for "${searchTerm}"` : ""} in {selectedCategory}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-4 flex-wrap">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center py-12 text-gray-500">
          No products found {searchTerm ? `for "${searchTerm}"` : ""}. Try a different search or category.
        </p>
      )}
    </div>
  );
};

export default Products;
