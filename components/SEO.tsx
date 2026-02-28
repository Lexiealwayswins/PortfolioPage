import React, { useEffect } from 'react';

type SEOProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  canonical?: string;
  type?: 'website' | 'article';
};

const DEFAULTS = {
  title: 'Lexie | Software Engineer, Full-Stack Developer, System Optimizer, Problem Solver',
  description:
    'Software Engineer, Full-Stack Developer, System Optimizer, Problem Solver. Building innovative web applications that make a real impact.',
  image: 'https://res.cloudinary.com/dyycmwk8h/image/upload/v1771995169/Avatar_kvssqz.png',
  url: 'https://portfolio-page-two-ruddy.vercel.app'
};

const SEO: React.FC<SEOProps> = ({ title = DEFAULTS.title, description = DEFAULTS.description, image = DEFAULTS.image, url = DEFAULTS.url, canonical, type = 'website' }) => {
  useEffect(() => {
    document.title = title;
    const ensureMeta = (attr: [string, string], content: string) => {
      const [key, value] = attr;
      let el = document.head.querySelector(`meta[${key}="${value}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(key, value);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    const ensureLink = (rel: string, href: string) => {
      let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };
    ensureMeta(['name', 'description'], description);
    ensureLink('canonical', canonical || url);
    ensureMeta(['property', 'og:type'], type);
    ensureMeta(['property', 'og:title'], title);
    ensureMeta(['property', 'og:description'], description);
    ensureMeta(['property', 'og:image'], image);
    ensureMeta(['property', 'og:url'], url);
    ensureMeta(['name', 'twitter:card'], 'summary_large_image');
    ensureMeta(['name', 'twitter:title'], title);
    ensureMeta(['name', 'twitter:description'], description);
    ensureMeta(['name', 'twitter:image'], image);
    // JSON-LD Schemas
    const addSchema = (id: string, schema: object) => {
      let script = document.getElementById(id) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(schema);
    };

    // WebSite Schema
    addSchema('app-schema', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Lexie',
      url: 'https://portfolio-page-two-ruddy.vercel.app',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://portfolio-page-two-ruddy.vercel.app/?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    });

    // Person Schema
    addSchema('person-schema', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'EliTechWiz',
      url: 'https://portfolio-page-two-ruddy.vercel.app',
      image: 'https://res.cloudinary.com/dyycmwk8h/image/upload/v1771995169/Avatar_kvssqz.png',
      jobTitle: 'Software Engineer, Full-Stack Developer, System Optimizer, Problem Solver',
      description: 'Software Engineer, Full-Stack Developer, System Optimizer, Problem Solver. Building innovative web applications that make a real impact.',
      email: 'lexiedlx@gmail.com',
      telephone: '',
      sameAs: [
        'https://github.com/Lexiealwayswins',
        'https://www.linkedin.com/in/lexie-duan-95aa23306/'
      ],
      knowsAbout: [
        'Software Development',
        'Software Architecture',
        'Web Development',
        'Frontend Development',
        'Backend Development'
      ],
      alumniOf: {
        '@type': 'Organization',
        name: 'Software Development'
      }
    });
  }, [title, description, image, url, canonical, type]);
  return null;
};

export default SEO;


