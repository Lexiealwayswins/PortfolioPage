import React from 'react';
import { motion } from 'framer-motion';
import Stats from './Stats';

const About: React.FC = () => {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 dark:text-white mb-4 px-4">About Me</h2>
      <div className="w-20 h-1 bg-orange-500 mx-auto mb-8 sm:mb-12"></div>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 sm:gap-12 px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center md:text-left"
        >
          <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 mb-4">
            I am Lexie, a strategic Full-Stack Developer and creative problem-solver, driven by the pursuit of engineering excellence and user-centric design. My expertise spans modern web development, robust backend architecture, AI integration, and cloud deployment.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 mb-4">
            With a passion for building products that make a real impact, I merge clean code, scalable system design, and business strategy to create seamless digital experiences. Drawing on over 4 years of industry experience, I thrive on translating complex business challenges into elegant, high-performance solutions.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 mb-4">
            Whether I'm optimizing database architectures for lightning-fast speeds, deploying automated machine learning pipelines, or crafting intuitive frontend interfaces, my goal is to transform ideas into reality with precision and a relentless drive for quality.
          </p>
           <p className="text-sm sm:text-base text-slate-500 dark:text-gray-300 font-semibold italic">
            Let's innovate, design, and dominate the digital future together.
          </p>
        </motion.div>
      </div>
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 dark:text-white mb-4">My Achievements</h2>
          <div className="w-20 h-1 bg-orange-500 mx-auto mb-8 sm:mb-12"></div>
          <Stats />
        </div>
      </section>
    </section>
  );
};

export default About;