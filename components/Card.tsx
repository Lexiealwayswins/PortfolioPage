import React from 'react';
import { motion } from 'framer-motion';
import { GithubIcon, YoutubeIcon, LinkedInIcon, TwitterIcon, FacebookIcon, MailIcon, LocationIcon, PageIcon } from '../constants';

const Card: React.FC = () => {
  const socialLinks = [
    { Icon: PageIcon, href: 'https://portfolio-page-two-ruddy.vercel.app/', label: 'PortfolioPage' },
    { Icon: GithubIcon, href: 'https://github.com/Lexiealwayswins', label: 'GitHub' },
    { Icon: LinkedInIcon, href: 'https://www.linkedin.com/in/lexie-duan-95aa23306/', label: 'LinkedIn' },
    // { Icon: YoutubeIcon, href: '#', label: 'YouTube' },
    // { Icon: TwitterIcon, href: '#', label: 'Twitter' },
    // { Icon: FacebookIcon, href: '#', label: 'Facebook' },
  ];
  return (
    <section id="card" className="py-12 sm:py-16 md:py-20">
      <div className="max-w-md mx-auto">
        <div className="bg-orange-50/70 dark:bg-slate-700/40 dark:border-slate-700/50 p-4 sm:p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 dark:shadow-slate-900/50 flex flex-col items-center gap-2 md:gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="w-56 h-56 sm:w-52 sm:h-52 md:w-50 md:h-50 rounded-xl shadow-lg border-4 border-orange-400/30">
              <img src="https://res.cloudinary.com/dyycmwk8h/image/upload/v1771995169/Avatar_kvssqz.png" alt="EliTechWiz" className="w-full h-full object-cover rounded-lg" loading="lazy" width="256" height="256" />
            </div>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 dark:text-white">Lexie</h2>
          <h2 className="text-sm sm:text-base text-center text-slate-900 dark:text-white bg-orange-100/70 hover:bg-amber-500 dark:hover:bg-amber-600 hover:text-white hover:scale-105 dark:bg-slate-700/50 px-4 mb-2 rounded-md">Software Engineer</h2>
          <div className="w-full h-0.5 bg-gray-300/50 mx-auto"></div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:w-6/7 text-center md:text-left flex flex-col"
          >
            <div className="flex flex-col pb-6 mx-4">
              <div className="flex flex-row pb-4">
                <a
                  key="Email"
                  href="mailto:lexiedlx@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Email"
                  className="w-12 h-12 flex items-center justify-center rounded-lg bg-orange-100 dark:bg-slate-800/50 dark:border dark:border-slate-700/50 text-slate-600 dark:text-gray-300 hover:bg-amber-500 dark:hover:bg-amber-500 dark:hover:border-amber-500/50 dark:hover:shadow-lg dark:hover:shadow-amber-500/30 hover:text-white transition-all duration-300" 
                >
                  <MailIcon />
                </a>
                <div className="pl-6 text-left">
                  <h3 className='text-slate-400'>EMAIL</h3>
                  <p>lexiedlx@gmail.com</p>
                </div>
              </div>
                <div className="flex flex-row">
                <a
                  key="Location"
                  href="https://www.google.com/maps?q=Vancouver,+BC,+CA"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Location"
                  className="w-12 h-12 flex items-center justify-center rounded-lg bg-orange-100 dark:bg-slate-800/50 dark:border dark:border-slate-700/50 text-slate-600 dark:text-gray-300 hover:bg-amber-500 dark:hover:bg-amber-500 dark:hover:border-amber-500/50 dark:hover:shadow-lg dark:hover:shadow-amber-500/30 hover:text-white transition-all duration-300" 
                >
                  <LocationIcon />
                </a>
                <div className="pl-6 text-left">
                  <h3 className='text-slate-400'>LOCATION</h3>
                  <p>Vancouver, BC, CA</p>
                </div>
              </div>
            </div>
            {/* <p className="text-base sm:text-lg text-slate-600 dark:text-gray-300 mb-8">
              A Software Engineer with a passion for building products that make a real impact.
            </p> */}
            <div className="flex items-center justify-center space-x-6 pb-4">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 dark:bg-slate-800/50 dark:border dark:border-slate-700/50 text-slate-600 dark:text-gray-300 hover:bg-amber-500 dark:hover:bg-amber-500 dark:hover:border-amber-500/50 dark:hover:shadow-lg dark:hover:shadow-amber-500/30 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default Card;