import { useMemo, useState } from 'react';
import ProjectCard from './ProjectCard.jsx';

const tabs = [
  { id: 'projects', label: 'Projects' },
  { id: 'favorite', label: 'Favorite' },

];

export default function ProjectsSection({ projects }) {
  const [activeTab, setActiveTab] = useState('projects');

  const visibleProjects = useMemo(() => {
    if (activeTab === 'favorite') {
      return projects.filter((project) => project.is_favorite);
    }

  

    return projects;
  }, [activeTab, projects]);

  return (
    <section id="projects" className="mx-auto w-full max-w-[1180px] scroll-mt-4 px-0 pb-20 sm:px-6 lg:px-10 lg:pb-28" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="sr-only">
        Project posts
      </h2>

      <div className="sticky top-0 z-20 border-y border-white/10 bg-ink/95 backdrop-blur sm:static sm:bg-transparent">
        <div className="mx-auto flex h-12 max-w-[402px] items-center justify-around font-filter text-[11px] font-semibold uppercase sm:max-w-none sm:justify-center sm:gap-12">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                className={`flex h-full items-center border-t-2 px-2 transition ${
                  isActive ? 'border-white text-white' : 'border-transparent text-white/35 hover:text-white'
                }`}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveTab(tab.id)}
                key={tab.id}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-0 pt-1 sm:pt-3">
        <div className="grid grid-cols-3 gap-0.5 sm:gap-2 lg:gap-3">
          {visibleProjects.map((project, index) => (
            <ProjectCard
              project={project}
              index={index}
              key={project.slug ?? project.id ?? project.title}
            />
          ))}
        </div>

        {visibleProjects.length === 0 ? (
          <div className="grid min-h-[180px] place-items-center text-center text-sm text-mist">
            No projects here yet.
          </div>
        ) : null}
      </div>
    </section>
  );
}
