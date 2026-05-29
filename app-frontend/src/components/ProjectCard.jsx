export default function ProjectCard({ project, index }) {
  const tags = project.tags ?? [];
  const likes = project.is_featured ? '2.4k' : `${1.2 + index / 10}k`;
  const comments = 18 + index * 7;

  return (
    <a
      className="group relative block aspect-square overflow-hidden bg-cyan-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-brand sm:rounded-[6px]"
      href={`/projects/${project.slug}`}
      aria-label={`Open ${project.title}`}
    >
      {project.image_url ? (
        <img className="h-full w-full object-cover transition duration-300 group-hover:scale-105" src={project.image_url} alt={project.title} loading="lazy" decoding="async" />
      ) : (
        <GeneratedProjectTile project={project} index={index} />
      )}

      <div className="absolute inset-0 flex flex-col justify-between bg-black/0 p-2 opacity-0 transition duration-200 group-hover:bg-black/60 group-hover:opacity-100 group-focus-visible:bg-black/60 group-focus-visible:opacity-100 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="hidden max-w-[76px] truncate rounded-full bg-white/90 px-2 py-1 text-[9px] font-bold uppercase text-ink sm:block sm:max-w-none sm:px-2.5 sm:text-xs">
            {project.category}
          </span>
          <span className="ml-auto rounded-full bg-black/25 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm">{project.year}</span>
        </div>

        <div>
          <h3 className="line-clamp-2 text-[11px] font-bold leading-tight text-white sm:text-xl">{project.title}</h3>
          <div className="mt-1 flex items-center gap-2 text-[10px] font-bold text-white sm:mt-3 sm:gap-4 sm:text-sm">
            <span className="inline-flex items-center gap-1">
              <HeartIcon /> {likes}
            </span>
            <span className="inline-flex items-center gap-1">
              <CommentIcon /> {comments}
            </span>
          </div>
          <p className="mt-2 hidden text-xs leading-snug text-white/80 sm:line-clamp-2">{tags.map((tag) => `#${tag.replace(/\s+/g, '')}`).join(' ')}</p>
        </div>
      </div>
    </a>
  );
}

function GeneratedProjectTile({ project, index }) {
  const gradients = [
    'from-cyan-brand via-[#16788f] to-ink',
    'from-[#abced6] via-cyan-brand to-[#07313b]',
    'from-[#1e5d6b] via-[#45b2ca] to-ink',
  ];

  return (
    <div className={`relative flex h-full w-full flex-col justify-between bg-gradient-to-br ${gradients[index % gradients.length]} p-3 sm:p-5`}>
      <div className="flex items-center justify-between">
        <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-ink/90 text-xs font-bold text-cyan-brand sm:h-12 sm:w-12 sm:text-lg">
          {project.category?.slice(0, 2).toUpperCase() ?? 'PR'}
        </span>
        <span className="hidden rounded-full border border-white/40 bg-white/10 px-2 py-1 text-[9px] font-bold text-white backdrop-blur sm:inline-flex sm:text-xs">
          {project.status}
        </span>
      </div>

      <div className="grid flex-1 place-items-center sm:hidden">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-white/15 text-base font-bold text-white backdrop-blur">
          {project.category?.slice(0, 2).toUpperCase() ?? 'PR'}
        </span>
      </div>

      <div className="hidden sm:block">
        <p className="hidden font-filter text-[9px] font-semibold uppercase tracking-[0.12em] text-white/70 sm:block sm:text-[11px]">{project.category}</p>
        <p className="mt-1 line-clamp-3 text-[13px] font-bold leading-[0.95] text-white sm:text-[28px]">{project.title}</p>
      </div>

      <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full border border-white/25 sm:h-36 sm:w-36" />
      <div className="pointer-events-none absolute bottom-7 right-7 h-14 w-14 rounded-full border border-white/20 sm:h-20 sm:w-20" />
    </div>
  );
}

function HeartIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" fill="currentColor" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" fill="currentColor" />
    </svg>
  );
}
