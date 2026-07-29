export interface Project {
  id: number;
  title: string;
  difficultyLevel: 'Newbie' | 'Junior' | 'Intermediate' | 'Advanced' | 'Guru';
  techStack: string[];
  demoUrl: string;
  githubUrl: string;
  image: string;
  isFeatured: boolean;
  description: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'Challenge Name',
    difficultyLevel: 'Intermediate',
    techStack: ['Vue', 'Tailwind'],
    demoUrl: '/trlanding-page-design.jpg',
    githubUrl: 'https://github.com/jaherreraf/repo',
    image: '/projects/trlanding-page-design.jpg',
    isFeatured: true,
    description: 'Brief description of the challenge and what you implemented.'
  },
  {
    id: 2,
    title: 'Tip Calculator',
    difficultyLevel: 'Newbie',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    demoUrl: 'public/projects/trlanding-page-design.jpg',
    githubUrl: 'https://github.com/jaherreraf/tip-calculator',
    image: 'public/projects/trlanding-page-design.jpg',
    isFeatured: false,
    description: 'Simple app to calculate tips and split the bill among several people.'
  },
  {
    id: 3,
    title: 'GitHub Profile Search',
    difficultyLevel: 'Junior',
    techStack: ['React', 'Tailwind', 'REST API'],
    demoUrl: 'https://tu-demo.com/github-search',
    githubUrl: 'https://github.com/jaherreraf/github-search',
    image: '/projects/trlanding-page-design.jpg',
    isFeatured: true,
    description: 'Search app using the GitHub API to display user metrics and data.'
  },
  {
    id: 4,
    title: 'E-Commerce Analytics Dashboard',
    difficultyLevel: 'Advanced',
    techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Recharts'],
    demoUrl: 'https://tu-demo.com/ecommerce-dashboard',
    githubUrl: 'https://github.com/jaherreraf/ecommerce-dashboard',
    image: '/projects/trlanding-page-design.jpg',
    isFeatured: true,
    description: 'Full admin dashboard with interactive charts and inventory management.'
  },
  {
    id: 5,
    title: 'Product Landing Page',
    difficultyLevel: 'Junior',
    techStack: ['Vue', 'Sass'],
    demoUrl: 'https://tu-demo.com/product-landing',
    githubUrl: 'https://github.com/jaherreraf/product-landing',
    image: '/projects/trlanding-page-design.jpg',
    isFeatured: false,
    description: 'Responsive landing page with smooth animations and Pixel Perfect layout.'
  },
  {
    id: 6,
    title: 'Online Learning Platform',
    difficultyLevel: 'Guru',
    techStack: ['React', 'Node.js', 'GraphQL', 'Tailwind'],
    demoUrl: 'https://tu-demo.com/learning-platform',
    githubUrl: 'https://github.com/jaherreraf/learning-platform',
    image: '/projects/trlanding-page-design.jpg',
    isFeatured: false,
    description: 'Comprehensive e-learning system with video player, user progress, and quizzes.'
  },
  {
    id: 7,
    title: 'Kanban Todo App',
    difficultyLevel: 'Intermediate',
    techStack: ['Svelte', 'Tailwind'],
    demoUrl: 'https://tu-demo.com/kanban-todo',
    githubUrl: 'https://github.com/jaherreraf/kanban-todo',
    image: '/projects/trlanding-page-design.jpg',
    isFeatured: false,
    description: 'Interactive Trello-style board with drag & drop support and local storage.'
  }
];
