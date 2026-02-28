import React from 'react';
import { GithubIcon, YoutubeIcon, LinkedInIcon, TwitterIcon, FacebookIcon, MailIcon, PageIcon } from '../constants';

interface FooterProps {
  onPrivacyClick?: () => void;
  onDocsClick?: () => void;
  onTermsClick?: () => void;
  onSecurityClick?: () => void;
  onCookieClick?: () => void;
  onDnsmpiClick?: () => void;
  onCommunityClick?: () => void;
  onStatusClick?: () => void;
}

const Footer: React.FC<FooterProps> = (props) => {
  const socialLinks = [
    { Icon: PageIcon, href: 'https://portfolio-page-two-ruddy.vercel.app/', label: 'PortfolioPage' },
    { Icon: GithubIcon, href: 'https://github.com/Lexiealwayswins', label: 'GitHub' },
    { Icon: LinkedInIcon, href: 'https://www.linkedin.com/in/lexie-duan-95aa23306/', label: 'LinkedIn' },
    // { Icon: YoutubeIcon, href: '#', label: 'YouTube' },
    // { Icon: TwitterIcon, href: '#', label: 'Twitter' },
    // { Icon: FacebookIcon, href: '#', label: 'Facebook' },
  ];

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 dark:border-t dark:border-slate-800/50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              <span className="text-orange-500">Lexie</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-gray-300 mb-4">
              Software Engineer, Full-Stack Developer, System Optimizer, Problem Solver. Building innovative web applications that make a real impact.
            </p>
            <div className="flex items-center space-x-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800/50 dark:border dark:border-slate-700/50 text-slate-600 dark:text-gray-300 hover:bg-amber-500 dark:hover:bg-amber-600 dark:hover:border-amber-500/50 dark:hover:shadow-lg dark:hover:shadow-amber-500/30 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#expertise" className="text-sm text-slate-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
                  Expertise
                </a>
              </li>
              <li>
                <a href="#journey" className="text-sm text-slate-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
                  Journey
                </a>
              </li>
              <li>
                <a href="#projects" className="text-sm text-slate-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
                  Projects
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Get In Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-slate-600 dark:text-gray-300">
                <MailIcon className="w-4 h-4 text-orange-500" />
                <a href="mailto:lexiedlx@gmail.com" className="hover:text-blue-500 transition-colors">
                  lexiedlx@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm text-slate-600 dark:text-gray-300">
                <GithubIcon className="w-4 h-4 text-orange-500" />
                <a href="https://github.com/Lexiealwayswins" className="hover:text-blue-500 transition-colors">
                  Lexiealwayswins
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm text-slate-600 dark:text-gray-300">
                <LinkedInIcon className="w-4 h-4 text-orange-500" />
                <a href="https://www.linkedin.com/in/lexie-duan-95aa23306/" className="hover:text-blue-500 transition-colors">
                  Lexie Duan
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-gray-700 pt-6">
          <div className="flex flex-col gap-4">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-300 text-center sm:text-left">
              &copy; {new Date().getFullYear()} Lexie. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;