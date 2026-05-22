import { useEffect, useState } from 'react';
import AdminDashboard from './components/AdminDashboard.jsx';
import ContactPage, { SocialPage } from './components/ContactPage.jsx';
import ProfileSurface from './components/ProfileSurface.jsx';
import ProjectDetailPage from './components/ProjectDetailPage.jsx';
import ProjectsSection from './components/ProjectsSection.jsx';
import { fallbackProfile, fallbackProjects } from './data/profile.js';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

export default function App() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [projects, setProjects] = useState(fallbackProjects);
  const path = window.location.pathname;
  const isAdminRoute = path === '/admin';

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    fetch(`${API_URL}/api/profile`)
      .then((response) => (response.ok ? response.json() : fallbackProfile))
      .then(setProfile)
      .catch(() => setProfile(fallbackProfile));

    fetch(`${API_URL}/api/projects`)
      .then((response) => (response.ok ? response.json() : fallbackProjects))
      .then(setProjects)
      .catch(() => setProjects(fallbackProjects));
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return <AdminDashboard />;
  }

  if (path === '/contact') {
    return <ContactPage profile={profile} />;
  }

  if (path === '/instagram' || path === '/whatsapp' || path === '/x') {
    return <SocialPage profile={profile} type={path.slice(1)} />;
  }

  if (path.startsWith('/projects/')) {
    return <ProjectDetailPage slug={decodeURIComponent(path.replace('/projects/', ''))} fallbackProjects={fallbackProjects} />;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-ink text-white antialiased">
      <section className="mx-auto flex w-full max-w-[1180px] items-center justify-center px-0 py-0 sm:px-6 sm:py-8 lg:min-h-screen lg:px-10">
        <ProfileSurface profile={profile} />
      </section>
      <ProjectsSection projects={projects} />
    </main>
  );
}
