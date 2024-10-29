import React, { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { RefreshCw, ShoppingCart, CreditCard, ArrowLeft } from "lucide-react";
import { ProductDetails } from "../components/Productdetails";

// ProductCard Component
const ProductCard = () => {
    const [csvData, setCsvData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [allData, setAllData] = useState([]);
    const [canLoad, setCanLoad] = useState(true);
    const navigate = useNavigate();
    const itemsPerPage = 6;
    const loadDelay = 800;

    const handleProductClick = (product) => {
        localStorage.setItem('selectedProduct', JSON.stringify(product));
        navigate(`/product/${product.id}`);
    };

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/Products.csv');

            if (!response.ok) {
                throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
            }

            const csvText = await response.text();

            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    console.log("Parsed CSV Data:", results.data);

                    const dataWithId = results.data.map((item, index) => ({
                        ...item,
                        id: item["Product ID"] || item.id || index
                    }));

                    setAllData(dataWithId);
                    setCsvData(dataWithId.slice(0, itemsPerPage));
                    setHasMore(dataWithId.length > itemsPerPage);
                    setLoading(false);
                },
                error: (error) => {
                    setError(`Error parsing CSV: ${error}`);
                    setLoading(false);
                }
            });
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const loadMoreData = useCallback(() => {
        if (loading || !hasMore || !canLoad) return;

        setLoading(true);
        setCanLoad(false);

        setTimeout(() => {
            const startIndex = currentPage * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const newData = allData.slice(startIndex, endIndex);

            if (newData.length > 0) {
                setCsvData(prev => [...prev, ...newData]);
                setCurrentPage(prev => prev + 1);
                setHasMore(endIndex < allData.length);
            } else {
                setHasMore(false);
            }
            setLoading(false);

            setTimeout(() => {
                setCanLoad(true);
            }, loadDelay);
        }, loadDelay);
    }, [currentPage, loading, hasMore, allData, canLoad]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            const scrollThreshold = 0.8;
            const hasReachedThreshold = (scrollTop + windowHeight) >= (documentHeight * scrollThreshold);

            if (hasReachedThreshold && !loading && hasMore && canLoad) {
                loadMoreData();
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMoreData, loading, hasMore, canLoad]);

    useEffect(() => {
        loadInitialData();
    }, []);

    const formatValue = (key, value) => {
        if (!value) return "N/A";
        if (key.toLowerCase().includes('price')) {
            return `$${parseFloat(value).toFixed(2)}`;
        }
        if (key.toLowerCase().includes('date')) {
            return new Date(value).toLocaleDateString();
        }
        return value;
    };

    const refresh = () => {
        setCsvData([]);
        setCurrentPage(1);
        setHasMore(true);
        setCanLoad(true);
        loadInitialData();
    };

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h2 className="text-red-600 font-semibold mb-2">Error Loading Data</h2>
                <p className="text-red-500">{error}</p>
                <button
                    onClick={refresh}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
                <button
                    onClick={refresh}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Data
                </button>
            </div>

            {csvData.length === 0 && !loading ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    No products found in the CSV file
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {csvData.map((product, index) => (
                        <div
                            key={`${index}-${product.id || index}`}
                            className="bg-white border rounded-xl p-4 hover:shadow-lg transition-all duration-300 relative overflow-hidden group cursor-pointer"
                            onClick={(e) => {
                                if (e.target.closest('button')) {
                                    e.stopPropagation();
                                    return;
                                }
                                handleProductClick(product);
                            }}
                        >
                            <div className="w-full flex items-center justify-center bg-gray-100">
                                <img
                                    src={`/api/placeholder/150/150`}
                                    alt={`Product Image`}
                                    className="object-cover rounded-lg w-full h-48"
                                />
                            </div>

                            <div className="space-y-3 mt-4">
                                {Object.entries(product).map(([key, value]) => {
                                    if (!value || value.toString().trim() === '' || key === 'Product ID') return null;

                                    const displayKey = key
                                        .split(/(?=[A-Z])|_/)
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                        .join(' ');

                                    return (
                                        <div key={key} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                                            <span className="font-medium text-gray-600 text-sm">{displayKey}</span>
                                            <span className="text-gray-800 font-semibold">
                                                {formatValue(key, value)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-4 relative h-10" onClick={e => e.stopPropagation()}>
                                <button className="absolute inset-0 w-full bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-300 group-hover:opacity-0">
                                    <ShoppingCart className="w-4 h-4" />
                                    Add to Cart
                                </button>

                                <div className="absolute inset-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <button className="flex-1 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
                                        <ShoppingCart className="w-4 h-4" />
                                        Cart
                                    </button>
                                    <button className="flex-1 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
                                        <CreditCard className="w-4 h-4" />
                                        Buy
                                    </button>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>
            )}

            {loading && (
                <div className="flex items-center justify-center min-h-[100px] mt-4">
                    <div className="animate-spin mr-2">
                        <RefreshCw className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="text-lg text-gray-600">Loading more products...</div>
                </div>
            )}

            {!hasMore && csvData.length > 0 && (
                <div className="text-center py-4 text-gray-500">
                    No more products to load
                </div>
            )}
        </div>
    );
};

export default ProductCard;