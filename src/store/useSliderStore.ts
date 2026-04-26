import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HeroSlide } from '../types';

interface SliderState {
  slides: HeroSlide[];
  addSlide: (slide: Omit<HeroSlide, 'id'>) => void;
  updateSlide: (id: string, slide: Partial<HeroSlide>) => void;
  deleteSlide: (id: string) => void;
  moveSlide: (index: number, direction: 'up' | 'down') => void;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1523050338692-7b84ba2111ef?auto=format&fit=crop&q=80&w=2000',
    title: 'Welcome to Apex Vidya',
    subtitle: 'Nurturing excellence through innovative education and global values.'
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=2000',
    title: 'Cutting Edge Infrastructure',
    subtitle: 'Modern labs, libraries, and smart classrooms designed for future leaders.'
  }
];

export const useSliderStore = create<SliderState>()(
  persist(
    (set) => ({
      slides: DEFAULT_SLIDES,
      addSlide: (slide) => set((state) => ({
        slides: [...state.slides, { ...slide, id: crypto.randomUUID() }]
      })),
      updateSlide: (id, updatedSlide) => set((state) => ({
        slides: state.slides.map((s) => s.id === id ? { ...s, ...updatedSlide } : s)
      })),
      deleteSlide: (id) => set((state) => ({
        slides: state.slides.filter((s) => s.id !== id)
      })),
      moveSlide: (index, direction) => set((state) => {
        const newSlides = [...state.slides];
        const nextIndex = direction === 'up' ? index - 1 : index + 1;
        if (nextIndex < 0 || nextIndex >= newSlides.length) return state;
        
        [newSlides[index], newSlides[nextIndex]] = [newSlides[nextIndex], newSlides[index]];
        return { slides: newSlides };
      }),
    }),
    {
      name: 'hero-slider-storage',
    }
  )
);
