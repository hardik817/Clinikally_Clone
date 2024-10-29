import React, { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, ShoppingCart, Zap } from 'lucide-react';

const ProductPage = ({ product = DEFAULT_PRODUCT }) => {
    const [selectedSize, setSelectedSize] = useState('50 gm');
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [offerIndex, setOfferIndex] = useState(0);

    const handlePrevOffer = () => {
        setOfferIndex(prev => (prev === 0 ? 3 : prev - 1));
    };

    const handleNextOffer = () => {
        setOfferIndex(prev => (prev === 3 ? 0 : prev + 1));
    };

    return (
        <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-8">
            {/* Left side - Images */}
            <div className="w-full md:w-1/2">
                <div className="flex gap-4">
                    <div className="w-20 flex flex-col gap-2">
                        {product.images.map((img, idx) => (
                            <div
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`border-2 rounded-lg cursor-pointer p-2 ${currentImageIndex === idx ? 'border-purple-500' : 'border-gray-200'
                                    }`}
                            >
                                <img src={img} alt={`Product view ${idx + 1}`} className="w-full" />
                            </div>
                        ))}
                    </div>
                    <div className="flex-1">
                        <div className="relative">
                            <img
                                src={product.images[currentImageIndex]}
                                alt="Main product"
                                className="w-full rounded-lg"
                            />
                            <button className="absolute right-2 bottom-2 bg-white p-2 rounded-full">
                                🔍
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between mt-4">
                    <div className="flex items-center gap-2 border border-purple-200 px-2 py-1 rounded-md">
                        <Check className="h-4 w-4 text-purple-600" />
                        101% Original
                    </div>
                    <div className="flex items-center gap-2 border border-purple-200 px-2 py-1 rounded-md">
                        <Check className="h-4 w-4 text-purple-600" />
                        Lowest Price
                    </div>
                    <div className="flex items-center gap-2 border border-purple-200 px-2 py-1 rounded-md">
                        <Check className="h-4 w-4 text-purple-600" />
                        Free Shipping
                    </div>
                </div>
            </div>

            {/* Right side - Product details */}
            <div className="w-full md:w-1/2">
                <div className="space-y-4">
                    <h1 className="text-2xl font-semibold">{product.name}</h1>

                    <div className="flex gap-2">
                        {product.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-md">
                                <Check className="h-4 w-4" />
                                {feature}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        {Array(5)
                            .fill(null)
                            .map((_, idx) => (
                                <span key={idx} className="text-yellow-400">
                                    {idx < Math.floor(product.rating) ? '★' : '☆'}
                                </span>
                            ))}
                        <span className="text-gray-600">
                            {product.rating} ({product.reviewCount} Reviews)
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
                        <span className="text-gray-500 line-through">₹{product.originalPrice}</span>
                        <div className="bg-purple-600 text-white px-2 py-1 rounded-md">
                            SAVE {product.discount}%
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="font-medium">Size:</p>
                        <div className="flex gap-4">
                            {product.sizes.map(size => (
                                <button
                                    key={size.value}
                                    onClick={() => setSelectedSize(size.value)}
                                    className={`px-4 py-2 rounded-md border ${selectedSize === size.value ? 'bg-purple-500 text-white' : 'border-gray-300'
                                        } relative`}
                                >
                                    {size.value}
                                    {size.saveMore && (
                                        <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-1 rounded-md">
                                            Save More
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="space-y-2">
                            <p className="font-medium">Qty:</p>
                            <select
                                value={quantity}
                                onChange={e => setQuantity(Number(e.target.value))}
                                className="border rounded-md p-2"
                            >
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 flex gap-4">
                            <button className="flex-1 gap-2 bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center">
                                <ShoppingCart className="h-5 w-5" />
                                Add to cart
                            </button>
                            <button className="flex-1 gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center">
                                <Zap className="h-5 w-5" />
                                Buy It Now
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-green-600">
                        <span>🚀</span>
                        <p>Recently in {product.cartCount} carts</p>
                    </div>

                    <div className="border p-4 rounded-md">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium">Available offers</h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrevOffer}
                                    className="border p-1 rounded-full hover:bg-gray-200"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <span className="text-sm text-gray-500">{offerIndex + 1}/4</span>
                                <button
                                    onClick={handleNextOffer}
                                    className="border p-1 rounded-full hover:bg-gray-200"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 flex items-start gap-2">
                            <span className="text-2xl">%</span>
                            <div>
                                <p className="font-medium">₹10 off on prepaid orders</p>
                                <p className="text-sm text-gray-500">Auto applied at checkout.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="font-medium">Select Delivery Location</p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter Pincode"
                                className="flex-1 border rounded-md p-2"
                            />
                            <button className="bg-purple-600 text-white px-4 py-2 rounded-md">
                                Check
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DEFAULT_PRODUCT = {
    name: '360 Block Sunscreen Gel SPF 50+',
    features: ['UV Protection', 'IR & Blue Light Protection', 'Pollutant Protection'],
    rating: 4.77,
    reviewCount: 153,
    price: 769,
    originalPrice: 899,
    discount: 14,
    sizes: [
        { value: '50 gm', saveMore: false },
        { value: '2 x 50 gm', saveMore: true }
    ],
    cartCount: 1534,
    images: [
        '/api/placeholder/400/400',
        '/api/placeholder/400/400',
        '/api/placeholder/400/400',
        '/api/placeholder/400/400',
        '/api/placeholder/400/400'
    ]
};

export default ProductPage;
