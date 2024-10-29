// ProductDetails Component
export const ProductDetails = () => {
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const productData = localStorage.getItem('selectedProduct');
        if (productData) {
            setProduct(JSON.parse(productData));
        }
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin mr-2">
                    <RefreshCw className="w-6 h-6 text-blue-500" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={handleBack}
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Products
            </button>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <img
                            src={`/api/placeholder/400/400`}
                            alt={`Product Image`}
                            className="h-96 w-full object-cover md:w-96"
                        />
                    </div>
                    <div className="p-8">
                        <div className="max-w-2xl">
                            {Object.entries(product).map(([key, value]) => {
                                if (!value || value.toString().trim() === '' || key === 'Product ID') return null;

                                const displayKey = key
                                    .split(/(?=[A-Z])|_/)
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                    .join(' ');

                                return (
                                    <div key={key} className="mb-4">
                                        <h3 className="text-gray-600 text-sm font-medium">{displayKey}</h3>
                                        <p className="text-gray-900 font-semibold mt-1">
                                            {key.toLowerCase().includes('price')
                                                ? `$${parseFloat(value).toFixed(2)}`
                                                : value}
                                        </p>
                                    </div>
                                );
                            })}

                            <div className="mt-8 flex gap-4">
                                <button className="flex-1 bg-blue-500 text-white rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
                                    <ShoppingCart className="w-4 h-4" />
                                    Add to Cart
                                </button>
                                <button className="flex-1 bg-green-500 text-white rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
                                    <CreditCard className="w-4 h-4" />
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};