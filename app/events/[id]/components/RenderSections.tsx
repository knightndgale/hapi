import { slideIn } from '@/lib/animations';
import { fadeIn } from '@/lib/animations';
import { Section } from '@/types/schema/Event.schema';
import { motion } from 'framer-motion';
import React from 'react'
import Image from 'next/image';

export const renderSections = (section: Section) => {
    switch (section.type) {
      case "content":
        return (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="py-12 px-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
            {section.description && (
              <div
                className="prose max-w-none prose-lg prose-pink prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary/80"
                dangerouslySetInnerHTML={{ __html: section.description }}
              />
            )}
          </motion.div>
        );
  
      case "image":
        return (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideIn} className="py-12 px-6">
            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
            {section.image && (
              <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-lg group">
                <Image
                  src={`${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${section.image}`}
                  alt={section.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
              </div>
            )}
          </motion.div>
        );
  
      default:
        return null;
    }
  

}
