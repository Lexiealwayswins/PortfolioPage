import React, { useState, useEffect} from 'react';
import { Routes, Route } from 'react-router-dom';
import { initVisitorTracking } from './utils/visitorTracking.js';
import Header from './components/Header';
import Hero from './components/Hero';
import Card from './components/Card';
import About from './components/About';
import Expertise from './components/Skills';
import Projects from './components/Projects';
import Journey from './components/Journey';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import ScrollProgress from './components/ScrollProgress';
import SkipToContent from './components/SkipToContent';
import AnimatedParticles from './components/AnimatedParticles';
import ProjectModal from './components/ProjectModal';
import type { Project } from './types';
import SEO from './components/SEO';
import NotFound from './pages/NotFound';
import ErrorBoundary from './pages/ErrorBoundary';
import ChatbotIcon from './components/ChatbotIcon';
import Chatbot from './components/Chatbot';

// Lazy load modals for better performance

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    // Initialize visitor tracking
    initVisitorTracking();

    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0px -20% 0px' });

    const validSections = Array.from(sections).filter((section): section is HTMLElement => section !== null);
    validSections.forEach(section => observer.observe(section));

    return () => validSections.forEach(section => observer.unobserve(section));
  }, []);

  return (
      <ErrorBoundary>
        <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-600 dark:text-gray-200" style={{ overflowX: 'clip'}}>
          <SEO />
          <SkipToContent />
          <ScrollProgress />
          <AnimatedParticles />
          <Header 
            activeSection={activeSection} 
          />
          <main className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <Routes>
              <Route path="/*" element={
                <>
                  <div className="w-full py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 lg:gap-12 w-full items-start">
                      <aside className="md:col-span-1">
                        <div className="md:sticky md:z-10 md:top-4 md:self-start md:max-h-[calc(100vh-2rem)] overflow-y-auto min-w-0">
                          <Card />
                        </div>
                      </aside>
                      <section className="md:col-span-2 min-w-0">
                        <Hero />
                        <About />
                        <Expertise />
                        <Journey />
                        <Projects onProjectClick={setSelectedProject} />
                        {/* <Testimonials /> */}
                        <Contact />
                      </section>
                    </div>
                  </div>
                </>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <div className="fixed bottom-10 right-10 z-[999] flex flex-col gap-4 items-end">
            <ScrollToTopButton />
            <ChatbotIcon 
              onClick={() => setIsChatbotOpen(!isChatbotOpen)} 
              isOpen={isChatbotOpen}
            />
          </div>
          {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
          {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
        </div>
      </ErrorBoundary>
  );
};

export default App;
