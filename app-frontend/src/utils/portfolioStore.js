import { fallbackProfile, fallbackProjects } from '../data/profile.js';

const PROFILE_KEY = 'portfolio_profile';
const PROJECTS_KEY = 'portfolio_projects';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'admin123';
const LEGACY_CV_HREF = '/ahmed-albabli-cv.txt';

const knownSkillCounts = {
  'ui ux': 8,
  development: 8,
  'graphic design': 8,
};

export function isAdminPassword(password) {
  return password === ADMIN_PASSWORD;
}

export function getProfile() {
  const profile = readJson(PROFILE_KEY, fallbackProfile);
  const projects = getAllProjects();

  return withStats(normalizeProfile(profile), projects);
}

export function saveProfile(profile) {
  const nextProfile = {
    ...fallbackProfile,
    ...profile,
    stats: undefined,
  };

  writeJson(PROFILE_KEY, nextProfile);

  return getProfile();
}

export function getAllProjects() {
  return sortProjects(readJson(PROJECTS_KEY, fallbackProjects));
}

export function getVisibleProjects() {
  return getAllProjects().filter((project) => !project.is_hidden);
}

export function getProjectBySlug(slug, includeHidden = false) {
  const projects = includeHidden ? getAllProjects() : getVisibleProjects();

  return projects.find((project) => project.slug === slug) ?? null;
}

export function saveProject(project, currentSlug) {
  const projects = getAllProjects();
  const slug = currentSlug ?? uniqueSlug(project.title, projects);
  const nextProject = normalizeProject({ ...project, slug });
  const nextProjects = currentSlug ? projects.map((item) => (item.slug === currentSlug ? nextProject : item)) : [...projects, nextProject];

  writeJson(PROJECTS_KEY, sortProjects(nextProjects));

  return nextProject;
}

export function updateProject(slug, updates) {
  const projects = getAllProjects();
  const nextProjects = projects.map((project) => (project.slug === slug ? normalizeProject({ ...project, ...updates }) : project));

  writeJson(PROJECTS_KEY, sortProjects(nextProjects));
}

export function deleteProject(slug) {
  writeJson(
    PROJECTS_KEY,
    getAllProjects().filter((project) => project.slug !== slug),
  );
}

export function resetPortfolioData() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(PROJECTS_KEY);
}

function withStats(profile, projects) {
  const visibleProjects = projects.filter((project) => !project.is_hidden);

  return {
    ...profile,
    stats: [
      { value: String(visibleProjects.length), label: 'Projects' },
      { value: String(skillItemCount(profile.skills ?? [])), label: 'Skills' },
      { value: '4', label: 'Years exp' },
    ],
  };
}

function normalizeProfile(profile) {
  return {
    ...profile,
    cvHref: profile.cvHref === LEGACY_CV_HREF ? fallbackProfile.cvHref : profile.cvHref,
  };
}

function skillItemCount(skills) {
  return skills.reduce((total, skill) => total + (knownSkillCounts[String(skill.label ?? '').toLowerCase()] ?? 1), 0);
}

function normalizeProject(project) {
  return {
    title: project.title ?? '',
    slug: project.slug ?? slugify(project.title ?? 'project'),
    category: project.category ?? 'UI UX',
    excerpt: project.excerpt ?? '',
    description: project.description ?? '',
    image_url: project.image_url ?? '',
    year: Number(project.year) || new Date().getFullYear(),
    status: project.status ?? 'Published',
    tags: project.tags ?? [],
    links: project.links ?? [],
    sort_order: Number(project.sort_order) || 0,
    is_featured: Boolean(project.is_featured),
    is_hidden: Boolean(project.is_hidden),
    is_favorite: Boolean(project.is_favorite),
  };
}

function uniqueSlug(title, projects) {
  const baseSlug = slugify(title);
  const usedSlugs = new Set(projects.map((project) => project.slug));

  if (!usedSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let index = 2;
  while (usedSlugs.has(`${baseSlug}-${index}`)) {
    index += 1;
  }

  return `${baseSlug}-${index}`;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function sortProjects(projects) {
  return [...projects].sort((a, b) => {
    const orderDiff = (a.sort_order ?? 0) - (b.sort_order ?? 0);

    if (orderDiff !== 0) {
      return orderDiff;
    }

    return (b.year ?? 0) - (a.year ?? 0);
  });
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
