
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Productcardslider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        { id: 1, content: "1st image for product" },
        { id: 2, content: "2nd image for product" },
        { id: 3, content: "3rd image for product" },
        { id: 4, content: "4rth image for product" },
    ];

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            {/* Slider Container */}
            <div className="relative overflow-hidden rounded-lg bg-gray-100 h-96 md:h-[500px] lg:h-[300px]">
                {/* Slides */}
                <div
                    className="flex h-full transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide) => (
                        <div
                            key={slide.id}
                            className="w-full flex-shrink-0 flex items-center justify-center text-xl md:text-2xl lg:text-3xl p-8"
                        >
                            {slide.content}
                        </div>
                    ))}
                </div>

                {/* Side Navigation Arrows */}
                <button
                    onClick={handlePrevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>

                <button
                    onClick={handleNextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </div>

            {/* Dots Navigation */}
            <div className="flex items-center justify-center gap-2 mt-6">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentSlide === index
                            ? "bg-blue-500 w-6"
                            : "bg-gray-300 hover:bg-gray-400"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Productcardslider;