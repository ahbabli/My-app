import { TbArrowLeft, TbExternalLink, TbMessageCircle } from 'react-icons/tb';
import { getProjectBySlug } from '../utils/portfolioStore.js';

export default function ProjectDetailPage({ slug }) {
  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink px-4 text-white antialiased">
        <section className="w-full max-w-[420px] rounded-[8px] border border-white/10 bg-[#080a12] p-6 text-center shadow-2xl shadow-black/30">
          <p className="font-filter text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-brand">Project not found</p>
          <h1 className="mt-3 text-3xl font-bold text-white">This project is not available.</h1>
          <a
            className="mx-auto mt-6 grid h-11 w-11 place-items-center rounded-full bg-cyan-brand text-white transition hover:bg-mist hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-brand"
            href="/#projects"
            aria-label="Back to projects"
          >
            <TbArrowLeft className="h-5 w-5" aria-hidden="true" />
          </a>
        </section>
      </main>
    );
  }

  const tags = project.tags ?? [];
  const links = project.links ?? [];
  const availableLinks = links.filter((link) => link.url);

  return (
    <main className="min-h-screen bg-ink px-0 py-0 text-white antialiased sm:px-6 sm:py-8 lg:px-10">
      <article className="mx-auto w-full max-w-[402px] bg-ink px-5 pb-36 pt-6 shadow-2xl shadow-black/30 sm:rounded-[28px] sm:px-[35px] sm:pb-[48px] sm:pt-[48px] lg:grid lg:min-h-[680px] lg:max-w-[1120px] lg:grid-cols-[420px_1fr] lg:gap-12 lg:rounded-[36px] lg:px-12 lg:py-12">
        <div>
          <a
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-mist transition hover:border-cyan-brand hover:bg-cyan-brand hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-brand"
            href="/#projects"
            aria-label="Back to projects"
          >
            <TbArrowLeft className="h-5 w-5" aria-hidden="true" />
          </a>

          <div className="mt-8 aspect-square overflow-hidden rounded-[8px] bg-cyan-brand sm:rounded-[14px]">
            <ProjectHero project={project} />
          </div>
        </div>

        <div className="mt-8 flex flex-col lg:mt-0 lg:justify-center">
          <p className="font-filter text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-brand">
            {project.category} · {project.year}
          </p>
          <h1 className="mt-3 text-[38px] font-bold leading-[0.96] text-white sm:text-[48px] lg:text-[58px]">{project.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist">{project.description || project.excerpt}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/75" key={tag}>
                #{tag.replace(/\s+/g, '')}
              </span>
            ))}
          </div>

          <ProjectActions links={availableLinks} variant="inline" />
        </div>
      </article>

      <ProjectActions links={availableLinks} variant="mobile" />
    </main>
  );
}

function ProjectActions({ links, variant }) {
  const isMobile = variant === 'mobile';
  const wrapperClass = isMobile
    ? 'fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-ink via-ink/95 to-transparent px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-6 sm:hidden'
    : 'mt-8 hidden gap-3 sm:flex sm:flex-wrap';
  const innerClass = isMobile ? 'mx-auto flex max-w-[402px] gap-2 rounded-[12px] border border-white/10 bg-[#080a12]/95 p-2 shadow-2xl shadow-black/45 backdrop-blur' : 'contents';
  const primaryClass = isMobile
    ? 'inline-flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-[8px] bg-cyan-brand px-3 text-sm font-bold text-white transition hover:bg-mist hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-brand'
    : 'inline-flex min-h-11 items-center justify-center gap-2 rounded-[9px] bg-cyan-brand px-5 text-sm font-bold text-white transition hover:bg-mist hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-brand';
  const secondaryClass = isMobile
    ? 'inline-flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-[8px] border border-white/10 px-3 text-sm font-bold text-white/78 transition hover:border-cyan-brand hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-brand'
    : 'inline-flex min-h-11 items-center justify-center gap-2 rounded-[9px] border border-white/10 px-5 text-sm font-bold text-white/70 transition hover:border-cyan-brand hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-brand';

  return (
    <div className={wrapperClass} aria-label="Project actions">
      <div className={innerClass}>
        {links.length ? (
          links.map((link) => (
            <a className={primaryClass} target="_blank" rel="noreferrer" href={link.url} key={link.label}>
              <span className="truncate">{link.label}</span>
              <TbExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          ))
        ) : (
          <span className={`${primaryClass} cursor-not-allowed bg-white/10 text-white/45 hover:bg-white/10 hover:text-white/45`} aria-disabled="true">
            Coming soon
          </span>
        )}
        <a className={secondaryClass} href="/contact">
          <span className="truncate">Contact</span>
          <TbMessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

function ProjectHero({ project }) {
  if (project.image_url) {
    return <img className="h-full w-full object-cover" src={project.image_url} alt={project.title} decoding="async" />;
  }

  return (
    <div className="flex h-full w-full flex-col justify-between bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.35),transparent_24%),linear-gradient(135deg,#45b2ca_0%,#0f7286_50%,#05060d_100%)] p-6 sm:p-8">
      <span className="grid h-14 w-14 place-items-center rounded-[16px] bg-ink/90 text-lg font-bold text-cyan-brand">
        {project.category?.slice(0, 2).toUpperCase() ?? 'PR'}
      </span>
      <div>
        <p className="font-filter text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">{project.category}</p>
        <p className="mt-2 text-[34px] font-bold leading-[0.95] text-white sm:text-[44px]">{project.title}</p>
      </div>
    </div>
  );
}
