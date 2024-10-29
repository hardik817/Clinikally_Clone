import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Papa from 'papaparse';
import { ChevronDown, ShoppingCart, Zap } from 'lucide-react';
import Productcardslider from './productcardslider';

function Product() {
    const [allData, setAllData] = useState([]);
    const [allData1, setAllData1] = useState([]);
    const [allData2, setAllData2] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pincode, setPincode] = useState('');
    const [pincodeValid, setPincodeValid] = useState(null);
    const [deliveryInfo, setDeliveryInfo] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [logisticsProvider, setLogisticsProvider] = useState(null);

    useEffect(() => {
        loadInitialData();
        loadInitialData1();
        loadInitialData2();

        // Update current time every minute
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

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
                    const dataWithId = results.data.map((item, index) => ({
                        ...item,
                        id: item["Product ID"] || item.id || index // Ensure we have an ID
                    }));
                    setAllData(dataWithId);
                    setLoading(false);
                    console.log("Parsed CSV Data with IDs:", dataWithId); // Log parsed data
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
    const loadInitialData1 = async () => {
        try {
            setLoading(true);
            const response = await fetch('/Stock.csv');
            if (!response.ok) {
                throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
            }

            const csvText = await response.text();
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const dataWithId2 = results.data.map((item, index) => ({
                        ...item,
                        id: item["Product ID"] || item.id || index // Ensure we have an ID
                    }));
                    setAllData1(dataWithId2);
                    setLoading(false);
                    console.log("Parsed CSV Data with IDs:", dataWithId2); // Log parsed data
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

    const loadInitialData2 = async () => {
        try {
            setLoading(true);
            const response = await fetch('/Pincodes.csv');
            if (!response.ok) {
                throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
            }
            const csvText = await response.text();
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const dataWithId3 = results.data.map((item, index) => ({
                        ...item,
                        id: item["Product ID"] || item.id || index // Ensure we have an ID
                    }));
                    setAllData2(dataWithId3);
                    setLoading(false);
                    console.log("Parsed Pincodes Data:", dataWithId3);
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

    const calculateDeliveryDate = (provider) => {
        const now = new Date();
        const hour = now.getHours();
        const isMetroCity = provider === "Provider A" || provider === "Provider B";

        if (provider === "Provider A") {
            if (hour < 17) { // Before 5 PM
                return {
                    date: now,
                    sameDayEligible: true,
                    cutoffTime: "5:00 PM",
                    message: "Order now for same-day delivery!"
                };
            } else {
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                return {
                    date: tomorrow,
                    sameDayEligible: false,
                    message: "Next day delivery"
                };
            }
        } else if (provider === "Provider B") {
            if (hour < 9) { // Before 9 AM
                return {
                    date: now,
                    sameDayEligible: true,
                    cutoffTime: "9:00 AM",
                    message: "Order now for same-day delivery!"
                };
            } else {
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                return {
                    date: tomorrow,
                    sameDayEligible: false,
                    message: "Next day delivery"
                };
            }
        } else { // General Partners
            const deliveryDate = new Date(now);
            const daysToAdd = isMetroCity ? 2 : 5;
            deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
            return {
                date: deliveryDate,
                sameDayEligible: false,
                message: `Delivery within ${daysToAdd} days`
            };
        }
    };

    const pincodechecker = () => {
        const foundPincode = allData2.find(pins => String(pins.Pincode) === String(pincode));
        if (foundPincode) {
            setPincodeValid(true);
            setLogisticsProvider(foundPincode["Logistics Provider"]);
            const deliveryEstimate = calculateDeliveryDate(foundPincode["Logistics Provider"]);
            setDeliveryInfo(deliveryEstimate);
        } else {
            setPincodeValid(false);
            setDeliveryInfo(null);
            setLogisticsProvider(null);
        }
    };

    const id1 = useParams();
    const product = allData.find(item => String(item.id) === String(id1.productId));
    const stock = allData1.find(stocks => String(stocks.id) === String(id1.productId));

    return (
        <div className="max-w-7xl mx-auto px-4 pt-4">
            <div className="text-sm breadcrumbs text-gray-500 mb-4">
                <span>Home</span>
                <span className="mx-2">/</span>
                <span>Sunscreen</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="relative">
                    <Productcardslider />
                </div>

                <div className="space-y-6">
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error}</p>}
                    {!loading && !error && product ? (
                        <ProductInfo
                            product={product}
                            stock={stock}
                            pincodechecker={pincodechecker}
                            setPincode={setPincode}
                            pincodeValid={pincodeValid}
                            deliveryInfo={deliveryInfo}
                            currentTime={currentTime}
                            logisticsProvider={logisticsProvider}
                        />
                    ) : (
                        <p>Product not found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProductInfo({
    product,
    stock,
    pincodechecker,
    setPincode,
    pincodeValid,
    deliveryInfo,
    currentTime,
    logisticsProvider
}) {
    const [timeLeft, setTimeLeft] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (deliveryInfo?.sameDayEligible) {
            const timer = setInterval(() => {
                const now = new Date();
                const cutoffTime = new Date(now);

                if (logisticsProvider === "Provider A") {
                    cutoffTime.setHours(17, 0, 0); // 5 PM
                } else if (logisticsProvider === "Provider B") {
                    cutoffTime.setHours(9, 0, 0); // 9 AM
                }

                const diff = cutoffTime - now;
                if (diff > 0) {
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    setTimeLeft(`${hours}h ${minutes}m`);
                } else {
                    setTimeLeft('Cutoff time passed');
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [deliveryInfo, logisticsProvider]);

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                    {product["Product Name"] || "360 Block Sunscreen Gel SPF 50+"}
                </h1>

                <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                        <div className="flex text-yellow-400">
                            {"★★★★½".split('').map((star, i) => (
                                <span key={i}>{star}</span>
                            ))}
                        </div>
                        <span className="ml-2 text-gray-600">4.77</span>
                    </div>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600">(153 Reviews)</span>
                </div>

                <div className="flex items-center space-x-3">
                    {['UV Protection', 'IR & Blue Light Protection', 'Pollutant Protection'].map((feature, index) => (
                        <div key={index} className="flex items-center space-x-1">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-sm">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold">{product["Price"]}</span>
                    <span className="text-gray-500 line-through">₹899</span>
                    <span className="bg-purple-600 text-white px-2 py-1 text-sm rounded">SAVE 14%</span>
                </div>

                <div className="space-y-2">
                    <span className="text-gray-700">Size:</span>
                    <div className="flex space-x-3">
                        <button className="px-4 py-2 border-2 border-purple-500  rounded-lg">
                            50 gm
                        </button>
                        <button className="px-4 py-2 border-2 border-gray-200 rounded-lg flex items-center">
                            2 x 50 gm
                            <span className="ml-2 text-xs text-green-600 font-medium">Save More</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <label className="mr-2">Qty:</label>
                        <div className="relative">
                            <select
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="appearance-none border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    <button className="flex-1 bg-white border-2 border-purple-600 text-purple-600 hover:text-white hover:bg-purple-600 py-3 rounded-lg flex items-center justify-center space-x-2">
                        <ShoppingCart className="w-5 h-5" />
                        <span>Add to cart</span>
                    </button>

                    <button className="flex-1 bg-purple-600 border-2 border-purple-600 text-white hover:text-purple-600 hover:bg-white py-3 rounded-lg flex items-center justify-center space-x-2">
                        <Zap className="w-5 h-5" />
                        <span>Buy It Now</span>
                    </button>
                </div>
            </div>

            <div className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span>🚀</span>
                        <span className="text-green-600">Recently in 1534 carts</span>
                        {stock && stock["Stock Available"] === "True" ? (
                            <span >Hurry! Only few left in stock</span>
                        ) : (
                            <span className="text-red-500 ">Currently Out of Stock</span>
                        )}
                    </div>

                </div>

                <div>
                    <h3 className="font-medium mb-2">Available offers</h3>
                    <div className="bg-yellow-50 p-4 rounded-lg flex items-start space-x-3">
                        <span className="text-2xl">🌟</span>
                        <div>
                            <p className="font-medium">Get free shipping</p>
                            <p className="text-sm text-gray-600">Auto-applied at checkout.</p>
                        </div>
                        <div className="ml-auto">
                            <span className="text-gray-500">3/4</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-medium">Select Delivery Location</h3>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Enter Pincode"
                            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            onChange={(e) => setPincode(e.target.value)}
                        />
                        <button
                            onClick={pincodechecker}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg"
                        >
                            Check
                        </button>
                    </div>

                    {pincodeValid === false && (
                        <p className="text-red-500">Sorry, we don't deliver to this pincode.</p>
                    )}

                    {pincodeValid && deliveryInfo && (
                        <div className="bg-green-50 p-4 rounded-lg">
                            {deliveryInfo.sameDayEligible ? (
                                <>
                                    <p className="text-green-600 font-medium">Same Day Delivery Available!</p>
                                    <p className="text-sm">Order within: <span className="font-bold">{timeLeft}</span></p>
                                </>
                            ) : (
                                <p className="text-gray-700">{deliveryInfo.message}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Product;