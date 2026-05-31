import { useEffect, useState } from 'react';
import { TbBrandFigma, TbCode, TbPalette, TbSparkles } from 'react-icons/tb';

const skillStories = {
  'UI UX': {
    eyebrow: 'Design toolkit',
    title: 'UI UX Skills',
    description: 'Research, wireframes, prototypes, and polished interfaces for digital products.',
    tools: ['Figma', 'Adobe XD', 'Wireframing', 'Prototyping', 'Design Systems', 'User Flows', 'UX Research', 'Usability Testing'],
    theme: {
      icon: 'border-[#a259ff]/55 bg-[#a259ff]/18 text-white',
      eyebrow: 'text-[#1abcfe]',
      title: 'text-white',
      description: 'text-[#c7f3ff]',
      background:
        'bg-[radial-gradient(circle_at_20%_18%,rgba(162,89,255,0.45),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(26,188,254,0.36),transparent_30%),radial-gradient(circle_at_65%_78%,rgba(10,207,131,0.25),transparent_32%),linear-gradient(160deg,#11111b_0%,#15101f_48%,#071319_100%)]',
      progress: ['bg-[#f24e1e]', 'bg-[#ff7262]', 'bg-[#a259ff]', 'bg-[#1abcfe]'],
      toolClasses: [
        'border-[#f24e1e]/35 bg-[#f24e1e]/18 text-[#ffb39f]',
        'border-[#a259ff]/35 bg-[#a259ff]/18 text-[#d9bdff]',
        'border-[#1abcfe]/35 bg-[#1abcfe]/16 text-[#b7efff]',
        'border-[#0acf83]/35 bg-[#0acf83]/16 text-[#b9f5db]',
      ],
    },
  },
  Development: {
    eyebrow: 'Build toolkit',
    title: 'Development Skills',
    description: 'Frontend implementation for responsive, clean, and interactive product experiences.',
    tools: ['React', 'Vite', 'Tailwind CSS', 'JavaScript', 'Laravel', 'Html,Css', 'Responsive UI', 'API Integration'],
    theme: {
      icon: 'border-[#61dafb]/50 bg-[#61dafb]/15 text-[#d8f8ff]',
      eyebrow: 'text-[#61dafb]',
      title: 'text-white',
      description: 'text-[#d7f9ff]',
      background:
        'bg-[radial-gradient(circle_at_18%_16%,rgba(97,218,251,0.34),transparent_30%),radial-gradient(circle_at_82%_72%,rgba(100,116,255,0.28),transparent_34%),linear-gradient(160deg,#06131a_0%,#0a1022_52%,#05060d_100%)]',
      progress: ['bg-[#61dafb]', 'bg-[#646cff]', 'bg-[#38bdf8]', 'bg-[#f7df1e]'],
      toolClasses: [
        'border-[#61dafb]/35 bg-[#61dafb]/14 text-[#d8f8ff]',
        'border-[#646cff]/35 bg-[#646cff]/16 text-[#d7d9ff]',
        'border-[#38bdf8]/35 bg-[#38bdf8]/14 text-[#d5f3ff]',
        'border-[#f7df1e]/35 bg-[#f7df1e]/12 text-[#fff1a6]',
      ],
    },
  },
  'Graphic design': {
    eyebrow: 'Visual toolkit',
    title: 'Graphic Design Skills',
    description: 'Brand visuals, social assets, identity systems, and layout work with a crisp visual direction.',
    tools: ['Photoshop', 'Illustrator', 'Brand Identity', 'Logo Design', 'Social Posts', 'Typography', 'Color Systems', 'Print Layouts'],
    theme: {
      icon: 'border-[#ff9f1c]/55 bg-[#ff9f1c]/18 text-[#fff0d6]',
      eyebrow: 'text-[#ffb703]',
      title: 'text-white',
      description: 'text-[#fff0d6]',
      background:
        'bg-[radial-gradient(circle_at_20%_18%,rgba(255,159,28,0.34),transparent_30%),radial-gradient(circle_at_78%_14%,rgba(255,0,110,0.28),transparent_32%),radial-gradient(circle_at_72%_80%,rgba(131,56,236,0.24),transparent_34%),linear-gradient(160deg,#180b14_0%,#1c1022_54%,#080a12_100%)]',
      progress: ['bg-[#ff9f1c]', 'bg-[#ff006e]', 'bg-[#8338ec]', 'bg-[#fb5607]'],
      toolClasses: [
        'border-[#31a8ff]/35 bg-[#31a8ff]/15 text-[#c7e8ff]',
        'border-[#ff9f1c]/35 bg-[#ff9f1c]/16 text-[#ffe0ad]',
        'border-[#ff006e]/35 bg-[#ff006e]/14 text-[#ffc0d9]',
        'border-[#8338ec]/35 bg-[#8338ec]/16 text-[#dec9ff]',
      ],
    },
  },
};

const skillIcons = {
  'UI UX': TbBrandFigma,
  Development: TbCode,
  'Graphic design': TbPalette,
};

function SkillIcon({ label, className = 'h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12' }) {
  const Icon = skillIcons[label] ?? TbSparkles;

  return <Icon className={className} aria-hidden="true" strokeWidth={1.8} />;
}

export default function Skills({ skills }) {
  const [activeSkill, setActiveSkill] = useState(null);

  useEffect(() => {
    if (!activeSkill) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveSkill(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeSkill]);

  const activeStory = activeSkill ? skillStories[activeSkill.label] : null;
  const activeTheme = activeStory?.theme;

  return (
    <>
      <section id="skills" className="mt-7 flex items-start justify-between gap-3 lg:mt-20 lg:max-w-[580px]" aria-label="Skills">
        {skills.map((skill) => (
          <article className="flex min-w-0 flex-1 flex-col items-center gap-2 lg:w-36 lg:flex-none lg:gap-5" key={skill.label}>
            <button
              className="story-pulse relative grid h-16 w-16 place-items-center rounded-full border border-ice/80 bg-cyan-brand text-white shadow-lg shadow-cyan-brand/20 transition hover:scale-105 hover:bg-[#62c9df] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-brand focus-visible:ring-offset-4 focus-visible:ring-offset-ink sm:h-[78px] sm:w-[78px] lg:h-24 lg:w-24"
              type="button"
              aria-label={`Open ${skill.label} skills`}
              onClick={() => setActiveSkill(skill)}
            >
              <span className="absolute inset-[7px] rounded-full border border-white/18 bg-white/10" />
              <SkillIcon label={skill.label} />
            </button>
            <h3 className="max-w-full truncate text-center text-[12px] font-normal leading-[1.15] text-white sm:text-[14px] lg:text-base">
              {skill.label}
            </h3>
          </article>
        ))}
      </section>

      {activeSkill && activeStory ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/82 px-3 py-3 backdrop-blur-md sm:px-4 sm:py-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="skill-story-title"
          onMouseDown={() => setActiveSkill(null)}
        >
          <div
            className={`relative flex h-[min(680px,calc(100dvh-24px))] w-full max-w-[390px] flex-col overflow-hidden rounded-[24px] border border-white/15 shadow-2xl shadow-black/60 sm:h-[min(720px,92vh)] sm:rounded-[28px] ${activeTheme.background}`}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),transparent_26%,rgba(0,0,0,0.28)_100%)]" />

            <div className="relative z-10 flex gap-1 px-4 pt-4">
              {activeStory.tools.slice(0, 4).map((tool, index) => (
                <span className="h-1 flex-1 rounded-full bg-white/30" key={tool}>
                  <span className={`block h-full rounded-full ${activeTheme.progress[index] ?? 'bg-white'}`} />
                </span>
              ))}
            </div>

            <div className="relative z-10 flex items-center justify-between px-4 pt-4 sm:px-5 sm:pt-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border ${activeTheme.icon}`}>
                  <SkillIcon label={activeSkill.label} className="h-7 w-7 text-white" />
                </div>
                <div className="min-w-0">
                  <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${activeTheme.eyebrow}`}>{activeStory.eyebrow}</p>
                  <p className="truncate text-sm font-bold text-white">{activeSkill.label}</p>
                </div>
              </div>

              <button
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-2xl leading-none text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-brand"
                type="button"
                aria-label="Close skills story"
                onClick={() => setActiveSkill(null)}
              >
                ×
              </button>
            </div>

            <div className="relative z-10 mt-auto min-h-0 overflow-y-auto px-4 pb-5 pt-8 sm:px-5 sm:pb-6">
              <h2 id="skill-story-title" className={`text-[30px] font-bold leading-[0.98] tracking-normal sm:text-[40px] ${activeTheme.title}`}>
                {activeStory.title}
              </h2>
              <p className={`mt-3 text-[13px] leading-5 sm:text-sm sm:leading-6 ${activeTheme.description}`}>{activeStory.description}</p>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-2.5">
                {activeStory.tools.map((tool, index) => (
                  <span className={`rounded-[10px] border px-2.5 py-2.5 text-center text-[13px] font-bold leading-tight sm:px-3 sm:py-3 sm:text-sm ${activeTheme.toolClasses[index % activeTheme.toolClasses.length]}`} key={tool}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
