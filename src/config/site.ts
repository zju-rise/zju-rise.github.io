/**
 * @file src/config/site.ts
 * @purpose Single source for laboratory identity, contact and navigation.
 * @maintain Set email and sampleContent before launch. Never put secrets here.
 */
export const site = {
  name: 'RISE',
  university: 'Zhejiang University',
  expansion: 'Robotics · Intelligence · Security · Environment',
  description: 'Security for intelligent agents and embodied AI at Zhejiang University.',
  location: 'Hangzhou, Zhejiang, China',
  // Shared recipient for the homepage Send Email button and site contact links.
  email: 'binbinz@zju.edu.cn',
  // Reject fictional sample entries; explicit TBD placeholders are allowed.
  sampleContent: false,
  // Keep noindex and a pending-content footer until the lab fills real records.
  contentPending: true,
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Research', href: '/research/' },
    { label: 'Publications', href: '/publications/' },
    { label: 'People', href: '/people/' },
  ],
};

export function contactHref(): string {
  const query = new URLSearchParams({
    subject: 'Research opportunities at RISE',
    body: 'Dear RISE team,\n\nI am interested in joining RISE.\n\nMy background:\nResearch interests:\n\nBest regards,\n',
  });
  // A blank mailto still opens a draft, but never sends mail automatically.
  return `mailto:${site.email}?${query.toString().replace(/\+/g, '%20')}`;
}
