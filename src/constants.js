export const EXAMPLE_JD = `Senior Product Designer

We're looking for a Senior Product Designer to join our growing product team. You'll own end-to-end design for core user flows, partner closely with engineering and product management, and help shape our design system.

Responsibilities:
• Lead UX/UI design for web and mobile products from discovery through delivery
• Create wireframes, prototypes, and high-fidelity designs in Figma
• Conduct user research and usability testing to validate design decisions
• Collaborate with engineers to ensure pixel-perfect implementation
• Contribute to and evolve our component library and design tokens

Requirements:
• 5+ years of product design experience at a tech company or agency
• Strong portfolio demonstrating complex B2B or SaaS product work
• Expert proficiency in Figma, prototyping tools, and design systems
• Experience with user research methodologies and data-informed design
• Excellent communication skills and ability to present to stakeholders

Nice to have:
• Experience with motion design and micro-interactions
• Familiarity with front-end development (HTML/CSS/React)
• Background in accessibility (WCAG) best practices

Location: San Francisco, CA (hybrid) or remote within the United States`;

export const MOCK_SEARCH_HISTORY = [
  {
    id: 1,
    snippet: 'Senior Product Designer — Figma, design systems, 5+ years...',
    timestamp: 'Aug 17, 2026 · 2:14 PM',
    jobDescription: EXAMPLE_JD,
    keywords: 'Figma, UX, design systems',
    experienceMin: '5',
    experienceMax: '10',
    location: 'United States',
    companyName: '',
    industry: 'Technology',
    mustInclude: 'figma, saas',
    mustNotInclude: 'recruiter, student',
    numResults: '10',
  },
  {
    id: 2,
    snippet: 'Frontend Engineer — React, TypeScript, Node.js...',
    timestamp: 'Aug 16, 2026 · 11:32 AM',
    jobDescription:
      'Frontend Engineer with 3+ years experience in React, TypeScript, and modern CSS. Build responsive web applications, collaborate with design team, write clean maintainable code.',
    keywords: 'React, TypeScript, Tailwind',
    experienceMin: '3',
    experienceMax: '8',
    location: 'India',
    companyName: '',
    industry: '',
    mustInclude: 'react, typescript',
    mustNotInclude: 'recruiter',
    numResults: '25',
  },
  {
    id: 3,
    snippet: 'Video Editor — Premiere Pro, After Effects, documentary...',
    timestamp: 'Aug 15, 2026 · 4:50 PM',
    jobDescription:
      'Video Editor for documentary and branded content. Expert in Adobe Premiere Pro and After Effects. 4+ years experience in post-production.',
    keywords: 'Premiere Pro, After Effects',
    experienceMin: '4',
    experienceMax: '',
    location: 'United Kingdom',
    companyName: 'Netflix',
    industry: 'Media and Entertainment',
    mustInclude: 'documentary, editor',
    mustNotInclude: 'agency, intern',
    numResults: '10',
  },
];

export const INITIAL_FORM_STATE = {
  jobDescription: '',
  keywords: '',
  experienceMin: '',
  experienceMax: '',
  location: '',
  companyName: '',
  industry: '',
  mustInclude: '',
  mustNotInclude: '',
  numResults: '10',
};

export function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function getScoreColor(score) {
  if (score > 80) return 'bg-success/15 text-success border border-success/30';
  if (score >= 60) return 'bg-gold-muted text-gold border border-gold/25';
  return 'bg-red-500/15 text-red-400 border border-red-500/30';
}

export function isHighMatch(score) {
  return score > 80;
}

export function getAvatarColor(name) {
  const colors = [
    'bg-ice/80',
    'bg-ice-dark/80',
    'bg-[#4A7FA8]',
    'bg-[#3D6E96]',
    'bg-[#5B8FB9]',
    'bg-[#6A9BC4]',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}
