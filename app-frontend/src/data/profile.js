import { asset2 } from '../utils/assets.js';

export const fallbackProfile = {
  name: 'Ahmed Albabli',
  handle: '@ahbabli',
  role: 'Product Designer',
  bio: 'I design and prototype digital products from initial brand identity to high-fidelity code-ready interfaces.',
  contactHref: 'mailto:ahbabli77@gmail.com',
  cvHref: '/Ahmed%20Albabli.pdf',
  socialHref: '#projects',
  photoUrl: '/assets/avatar.png',
  storyPhotoUrl: '/assets/story.jpeg',
  stats: [
    { value: '24', label: 'Projects' },
    { value: '24', label: 'Skills' },
    { value: '4', label: 'Years exp' },
  ],
  skills: [
    { label: 'UI UX', icon: 'uiux-icon.svg', iconClass: 'h-[45px] w-8' },
    { label: 'Development', icon: 'dev-icon.svg', iconClass: 'h-[43px] w-12' },
    { label: 'Graphic design', icon: 'graphic-icon.svg', iconClass: 'h-[78px] w-[78px]' },
  ],
};

export const fallbackProjects = [
  {
    title: 'FitTrack App',
    slug: 'mobile Fitness Tracking app',
    category: 'UI UX',
    excerpt: 'FitTrack is a fitness tracking mobile application designed to help users monitor workouts, daily activity, and personal fitness progress through a clean and motivating interface.',
    year: 2026,
    status: 'Published',
    image_url: asset2('0.jpg'),
    is_featured: true,
    is_hidden: false,
    is_favorite: true,
    tags: ['Figma', 'Mobile App', 'Design System'],
    links: [{ label: 'See Details', url: 'https://www.behance.net/gallery/243682853/FitTrack-app-Ui-Ux-design' }],
  },
  {
    title: 'SaaS Analytics Landing Page',
    slug: 'saas-analytics-landing-page',
    category: 'Development',
    excerpt: 'A responsive marketing page for an analytics product with reusable React sections.',
    year: 2025,
    status: 'Published',
    is_featured: false,
    is_hidden: false,
    is_favorite: false,
    tags: ['React', 'Tailwind CSS', 'Vite'],
    links: [
      { label: 'Live Demo', url: '#' },
      { label: 'Source', url: '#' },
    ],
  },
  {
    title: 'Brand Identity Kit',
    slug: 'brand-identity-kit',
    category: 'Graphic design',
    excerpt: 'Logo, palette, typography, and launch visuals for a digital product brand.',
    year: 2025,
    status: 'Published',
    is_featured: false,
    is_hidden: false,
    is_favorite: false,
    tags: ['Branding', 'Logo', 'Social Assets'],
    links: [{ label: 'Preview', url: '#' }],
  },
];
