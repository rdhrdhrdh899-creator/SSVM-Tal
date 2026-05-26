import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionTitle } from '../ui/SectionTitle';
import { Card } from '../ui/Card';

const testimonials = [
  {
    id: 1,
    name: "Dr. Anish Sharma",
    role: "Parent of Grade 8 Student",
    message: "The school's focus on both academics and extracurriculars is truly commendable. My son has shown remarkable growth in his confidence and public speaking skills.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anish"
  },
  {
    id: 2,
    name: "Mrs. Priya Verma",
    role: "Parent of Grade 5 Student",
    message: "Moving our daughter to this school was the best decision we made. The digital classrooms and personalized attention from teachers are top-notch.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
  },
  {
    id: 3,
    name: "Mr. Rajesh Gupta",
    role: "Parent of Grade 10 Student",
    message: "The sports facilities and professional coaching here are exceptional. It's refreshing to see a school that truly values physical education as much as science.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh"
  },
  {
    id: 4,
    name: "Sunita Reddy",
    role: "Parent of Grade 2 Student",
    message: "The foundation years curriculum is very engaging. My daughter loves the activity-based learning approach and always looks forward to school.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita"
  }
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <section className="py-24 bg-cream-50 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy-900/5 rounded-full blur-3xl -ml-32 -mb-32" />

      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Voice of our Parents" 
          subtitle="Honest feedback from the guardians of our future leaders." 
        />

        <div className="max-w-4xl mx-auto relative px-4 md:px-12">
          <div className="relative h-[420px] sm:h-[340px] md:h-[280px] lg:h-[250px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.3 }
                }}
                className="absolute w-full"
              >
                <Card className="p-6 sm:p-8 md:p-12 border-0 shadow-xl bg-white rounded-3xl relative overflow-hidden group animate-none">
                  <Quote className="absolute top-4 right-4 md:top-6 md:right-8 text-gold-400/20 group-hover:text-gold-400/40 transition-colors w-12 h-12 md:w-20 md:h-20" strokeWidth={1} />
                  
                  <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
                    <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full border-4 border-gold-100 p-1 bg-white shadow-lg overflow-hidden">
                      <img 
                        src={testimonials[currentIndex].image} 
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    
                    <div className="text-center md:text-left flex-1">
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-navy-800 italic font-medium leading-relaxed mb-4 md:mb-6">
                        "{testimonials[currentIndex].message}"
                      </p>
                      
                      <div>
                        <h4 className="heading-serif text-lg md:text-xl font-bold text-navy-950">{testimonials[currentIndex].name}</h4>
                        <p className="text-[10px] md:text-xs font-bold text-gold-600 uppercase tracking-widest mt-1">
                          {testimonials[currentIndex].role}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls & Pagination / Style 1 - Elegant High-contrast Navy & Gold Chevrons */}
            <div className="block">
              <button 
                id="testimonial-prev-btn"
                onClick={handlePrev}
                className="absolute left-2 md:-left-16 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center bg-navy-950 hover:bg-gold-500 text-white hover:text-navy-950 shadow-xl border border-gold-500/30 rounded-full transition-all duration-300 hover:-translate-x-1 z-30 active:scale-95"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft size={22} className="stroke-[2.5]" />
              </button>
              <button 
                id="testimonial-next-btn"
                onClick={handleNext}
                className="absolute right-2 md:-right-16 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center bg-navy-950 hover:bg-gold-500 text-white hover:text-navy-950 shadow-xl border border-gold-500/30 rounded-full transition-all duration-300 hover:translate-x-1 z-30 active:scale-95"
                aria-label="Next Testimonial"
              >
                <ChevronRight size={22} className="stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Minimalist Dashboard-Style Active Bar Indicators & Step Count */}
          <div className="flex flex-col items-center gap-4 mt-12 relative z-20">
            {/* Step count indicator */}
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-navy-950 font-sans">
              <span className="text-gold-600">{currentIndex + 1}</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-400">{testimonials.length}</span>
            </div>

            {/* Pagination Slits */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    currentIndex === i 
                      ? 'w-10 bg-gradient-to-r from-gold-500 to-gold-600 shadow-md shadow-gold-500/30' 
                      : 'w-3 bg-gray-200 hover:bg-gold-300/70'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
