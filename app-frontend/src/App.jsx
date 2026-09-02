import { useMemo } from 'react';
import AdminDashboard from './components/AdminDashboard.jsx';
import ContactPage, { SocialPage } from './components/ContactPage.jsx';
import ProfileSurface from './components/ProfileSurface.jsx';
import ProjectDetailPage from './components/ProjectDetailPage.jsx';
import ProjectsSection from './components/ProjectsSection.jsx';
import { getProfile, getVisibleProjects } from './utils/portfolioStore.js';

export default function App() {
  const profile = useMemo(() => getProfile(), []);
  const projects = useMemo(() => getVisibleProjects(), []);
  const path = window.location.pathname;
  const isAdminRoute = path === '/admin';

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
    return <ProjectDetailPage slug={decodeURIComponent(path.replace('/projects/', ''))} />;
  }

  return (
    <main id="main-content" className="min-h-screen overflow-hidden bg-ink text-white antialiased">
      <section className="mx-auto flex w-full max-w-[1180px] items-center justify-center px-0 py-0 sm:px-6 sm:py-8 lg:min-h-screen lg:px-10">
        <ProfileSurface profile={profile} />
      </section>
      <ProjectsSection projects={projects} />
    </main>
  );
}
