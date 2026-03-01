// FIX: Define the Project and Stat interfaces used throughout the application.
export interface Project {
  title: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  caseStudySlug?: string; // Optional slug to a detailed case study page
}

export interface Stat {
  value: number;
  label: string;
}

// FIX: Add the Message interface for the chatbot component.
export interface Message {
  sender: 'user' | 'ai';
  text: string;
}

/* -------------------------------------------------------
   Turnstile type declaration (supports render/remove)
   ------------------------------------------------------- */
declare global {
  interface Window {
    turnstile: {
      render: (
        element: string | HTMLElement,
        options: {
          sitekey: string;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact';
          appearance?: 'always' | 'execute' | 'interaction-only';
          callback?: (token: string) => void;
          'error-callback'?: (error: string) => void;
          'expired-callback'?: () => void;
        }
      ) => string; // widgetId

      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export {};
