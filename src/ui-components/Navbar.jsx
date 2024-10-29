import React, { useState } from "react";
import { ShoppingCart, User, ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const menuItems = [
        {
            title: "Brands",
            dropdownItems: ["Brand 1", "Brand 2", "Brand 3"]
        },
        {
            title: "Skin",
            dropdownItems: ["Skin Care", "Sun Protection", "Moisturizers"]
        },
        {
            title: "Hair",
            dropdownItems: ["Hair Care", "Shampoos", "Conditioners"]
        },
        {
            title: "Supplements",
        },
        {
            title: "Pediatric",
        },
        {
            title: "Shop ALL",
        },
        {
            title: "Luxe",
        },
        {
            title: "More",
            dropdownItems: ["Gifts", "Accessories"]
        },
        {
            title: "Treatment Finder",
        }
    ];

    return (
        <>
            {/* Top Navbar */}
            <div className="fixed w-full left-0 top-0 bg-white z-50 shadow-sm">
                <div className="relative flex items-center justify-between py-2 px-4 md:px-8">
                    {/* Left Section with Menu Button */}
                    <div className="flex items-center">
                        <button
                            className="lg:hidden flex items-center justify-center"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    {/* Center Section with Logo */}
                    <div className="flex items-center justify-center flex-1 mx-4">
                        <div className="flex items-center space-x-2">
                            <svg
                                className="h-8 w-8 flex-shrink-0"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect width="32" height="32" rx="16" fill="#4F46E5" />
                                <path
                                    d="M16 8C11.6 8 8 11.6 8 16C8 20.4 11.6 24 16 24C20.4 24 24 20.4 24 16C24 11.6 20.4 8 16 8ZM16 22C12.7 22 10 19.3 10 16C10 12.7 12.7 10 16 10C19.3 10 22 12.7 22 16C22 19.3 19.3 22 16 22Z"
                                    fill="white"
                                />
                            </svg>
                            <h1 className="text-xl md:text-4xl font-semibold whitespace-nowrap">Clinikally</h1>
                        </div>
                    </div>

                    {/* Right Section with Login and Cart */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <User className="h-6 w-6 text-gray-600" />
                            <span className="hidden md:inline text-xl font-normal">Login</span>
                        </div>
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <ShoppingCart className="h-6 w-6 text-gray-600" />
                            <span className="hidden md:inline text-xl font-normal">Cart</span>
                        </div>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:block border-t border-gray-200">
                    <div className="container mx-auto">
                        <ul className="flex justify-center space-x-6 text-lg font-medium py-2 px-4">
                            {menuItems.map((item, index) => (
                                <li
                                    key={index}
                                    className="relative"
                                    onMouseEnter={() => setActiveDropdown(index)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <button className="flex items-center hover:text-gray-700">
                                        {item.title}
                                        {item.dropdownItems && (
                                            <ChevronDown className="h-5 w-5 ml-1 text-gray-600" />
                                        )}
                                    </button>
                                    {item.dropdownItems && activeDropdown === index && (
                                        <div className="absolute left-0 top-full bg-white shadow-md rounded-md w-40 z-50">
                                            <ul className="text-left py-1">
                                                {item.dropdownItems.map((dropdownItem, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        {dropdownItem}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-200">
                        <div className="px-4 py-2">
                            <ul className="space-y-2 py-4">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <button
                                            className="w-full text-left px-2 py-2 hover:bg-gray-100 rounded-md"
                                            onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                                        >
                                            <div className="flex justify-between items-center">
                                                {item.title}
                                                {item.dropdownItems && (
                                                    <ChevronDown
                                                        className={`h-5 w-5 transform transition-transform ${activeDropdown === index ? 'rotate-180' : ''}`}
                                                    />
                                                )}
                                            </div>
                                        </button>
                                        {item.dropdownItems && activeDropdown === index && (
                                            <ul className="ml-4 mt-2 space-y-2">
                                                {item.dropdownItems.map((dropdownItem, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="px-4 py-2 hover:bg-gray-100 rounded-md"
                                                    >
                                                        {dropdownItem}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
            {/* Spacer to avoid content overlap with fixed navbar */}
            <div className="h-16 lg:h-24"></div>
        </>
    );
}