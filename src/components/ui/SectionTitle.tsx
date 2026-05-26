import { motion } from 'motion/react';

export const SectionTitle = ({ title, subtitle, light = false }: { title: string; subtitle?: string; light?: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className={`heading-serif text-3xl md:text-5xl font-bold mb-4 ${light ? 'text-white' : 'text-navy-950'}`}>
        {title}
      </h2>
      <div className="w-24 h-1.5 bg-gold-400 mx-auto rounded-full mb-6" />
      {subtitle && (
        <p className={`text-lg max-w-2xl mx-auto ${light ? 'text-cream-50/80' : 'text-gray-600 font-medium'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
