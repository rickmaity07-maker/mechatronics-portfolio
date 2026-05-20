import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProjectCard({ project, animateIn = false }) {
  return (
    <motion.div
      // If we want it to fade in as we scroll down the page
      initial={animateIn ? { opacity: 0, y: 20 } : false}
      whileInView={animateIn ? { opacity: 1, y: 0 } : false}
      viewport={{ once: true }}
      // The universal hover magnification
      whileHover={{ scale: 1.01 }}
      transition={{ ease: "easeOut", duration: 0.4 }}
      className="relative border border-zinc-800 bg-zinc-950 p-8 md:p-12 min-h-[400px] flex flex-col justify-end overflow-hidden group"
    >
      {project.image && (
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>

      <h4 className="text-3xl md:text-4xl font-light text-white mb-2 relative z-10 drop-shadow-lg">{project.title}</h4>
      <p className="text-zinc-400 max-w-xl relative z-10 mb-8">{project.desc}</p>

      <div className="relative z-10">
        <Link
          to={project.link}
          className="inline-block px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all"
        >
          VIEW DETAILS
        </Link>
      </div>
    </motion.div>
  );
}