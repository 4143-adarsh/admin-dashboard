// Placeholder images from Unsplash
const placeholderImages = {
  'software-dev': 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'web-dev': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'mobile-dev': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'cloud-devops': 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'ai-automation': 'https://images.unsplash.com/photo-1677442135136-760c81388f98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'it-consulting': 'https://images.unsplash.com/photo-1522071820081-009c5fdc0a27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
} as const;

type ImageKey = keyof typeof placeholderImages;

export const getPlaceholderImage = (key: string): string => {
  return placeholderImages[key as ImageKey] || placeholderImages['software-dev'];
};

// SVG Icons as React components
export const Icons = {
  code: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  ),
  globe: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  ),
  smartphone: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="18" x2="12.01" y2="18"></line>
    </svg>
  ),
  cloud: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
    </svg>
  ),
  ai: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 16.98h-5.99c-1.1 0-2-.9-2-2v-1.5"></path>
      <path d="M6 6h4v4"></path>
      <path d="M4 13.5V8a2 2 0 0 1 2-2h4"></path>
      <path d="M6 18h4v4"></path>
      <path d="M14 18h8v4"></path>
      <path d="M18 16.98v-5.98h2a2 2 0 0 1 2 2v1.5a2 2 0 0 1-2 2z"></path>
      <path d="M18 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
      <path d="M6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
    </svg>
  ),
  consulting: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="12" y1="18" x2="12.01" y2="18"></line>
      <line x1="9" y1="14" x2="15" y2="14"></line>
      <line x1="9" y1="10" x2="15" y2="10"></line>
    </svg>
  ),
};
