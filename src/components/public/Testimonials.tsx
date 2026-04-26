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

        <div className="max-w-4xl mx-auto relative px-12">
          <div className="relative h-[300px] md:h-[250px] flex items-center justify-center">
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
                <Card className="p-8 md:p-12 border-0 shadow-xl bg-white rounded-3xl relative overflow-hidden group">
                  <Quote className="absolute top-6 right-8 text-gold-400/20 group-hover:text-gold-400/40 transition-colors" size={80} strokeWidth={1} />
                  
                  <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-24 h-24 shrink-0 rounded-full border-4 border-gold-100 p-1 bg-white shadow-lg overflow-hidden">
                      <img 
                        src={testimonials[currentIndex].image} 
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    
                    <div className="text-center md:text-left flex-1">
                      <p className="text-lg md:text-xl text-navy-800 italic font-medium leading-relaxed mb-6">
                        "{testimonials[currentIndex].message}"
                      </p>
                      
                      <div>
                        <h4 className="heading-serif text-xl font-bold text-navy-950">{testimonials[currentIndex].name}</h4>
                        <p className="text-xs font-bold text-gold-600 uppercase tracking-widest mt-1">
                          {testimonials[currentIndex].role}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="hidden md:block">
            <button 
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-4 bg-white shadow-lg rounded-full text-navy-900 hover:bg-navy-900 hover:text-white transition-all z-20"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-4 bg-white shadow-lg rounded-full text-navy-900 hover:bg-navy-900 hover:text-white transition-all z-20"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === i ? 'w-8 bg-gold-500' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
