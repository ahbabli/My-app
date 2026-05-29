import { useEffect, useState } from 'react';
import { asset } from '../utils/assets.js';

export default function ProfileHeader({ profile }) {
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const photoSrc = profile.photoUrl || asset('avatar.png');
  const storyPhotoSrc = asset('story.jpeg');

  useEffect(() => {
    if (!isStoryOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsStoryOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isStoryOpen]);

  return (
    <header className="grid grid-cols-[108px_1fr] items-center gap-5 sm:block lg:flex lg:flex-col lg:justify-center">
      <button
        className="relative h-[104px] w-[104px] rounded-full transition hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-brand focus-visible:ring-offset-4 focus-visible:ring-offset-ink sm:h-[166px] sm:w-[166px] lg:h-[220px] lg:w-[220px]"
        type="button"
        aria-label={`Open ${profile.name} profile story`}
        onClick={() => setIsStoryOpen(true)}
      >
        <img className="absolute inset-0 h-full w-full" src={asset('avatar-ring.svg')} alt="" />
        <img
          className="absolute left-[3px] top-0.5 h-[101px] w-[101px] rounded-full object-cover sm:left-1 sm:top-[3px] sm:h-[162px] sm:w-[162px] lg:h-[214px] lg:w-[214px]"
          src={photoSrc}
          alt={`${profile.name} profile`}
        />
      </button>

      <div className="min-w-0 sm:mt-[39px] lg:mt-10">
        <a className="inline-block transition hover:text-cyan-brand" href={profile.socialHref ?? '#projects'}>
          <h1 className="text-[27px] font-bold leading-[1.02] tracking-normal text-white sm:text-[31px] lg:text-[42px]">{profile.name}</h1>
        </a>
        <a className="mt-0.5 block text-[18px] leading-[1.16] text-mist transition hover:text-white sm:-mt-0.5 sm:text-[21px] lg:text-[24px]" href={profile.socialHref ?? '#projects'}>
          {profile.handle}
        </a>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-[34px] sm:flex sm:items-center sm:gap-3 lg:mt-9">
          <a
            className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-[9px] bg-mist px-3 text-[15px] font-bold leading-none text-ink transition hover:bg-white sm:min-h-[43px] sm:w-[104px] sm:px-3.5 sm:py-2.5 sm:text-[20px]"
            href="/contact"
          >
            Contact
          </a>
          <a
            className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-[9px] bg-cyan-brand px-3 text-[15px] font-bold leading-none text-white transition hover:bg-[#62c9df] sm:min-h-[43px] sm:w-[157px] sm:px-3.5 sm:py-2.5 sm:text-[20px]"
            href={profile.cvHref}
          >
            <span className="sm:hidden">CV</span>
            <span className="hidden sm:inline">Download CV</span>
          </a>
        </div>
      </div>

      {isStoryOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/82 px-3 py-3 backdrop-blur-md sm:px-4 sm:py-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-story-title"
          onMouseDown={() => setIsStoryOpen(false)}
        >
          <div
            className="relative flex h-[min(680px,calc(100dvh-24px))] w-full max-w-[390px] flex-col overflow-hidden rounded-[24px] border border-white/15 bg-[#080a12] shadow-2xl shadow-black/60 sm:h-[min(720px,92vh)] sm:rounded-[28px]"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <img className="absolute inset-0 h-full w-full object-cover" src={storyPhotoSrc} alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/8 to-black/78" />

            <div className="relative z-10 flex gap-1 px-4 pt-4">
              <span className="h-1 flex-1 rounded-full bg-white" />
            </div>

            <div className="relative z-10 flex items-center justify-between px-4 pt-4 sm:px-5 sm:pt-5">
              <div className="flex min-w-0 items-center gap-3">
                <img className="h-11 w-11 shrink-0 rounded-full border border-white/30 object-cover" src={photoSrc} alt="" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{profile.name}</p>
                  <p className="truncate text-xs text-mist">{profile.handle}</p>
                </div>
              </div>

              <button
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/28 text-2xl leading-none text-white transition hover:bg-black/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-brand"
                type="button"
                aria-label="Close profile story"
                onClick={() => setIsStoryOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="relative z-10 mt-auto px-5 pb-6">
              <h2 id="profile-story-title" className="text-[34px] font-bold leading-[0.98] tracking-normal text-white sm:text-[42px]">
                {profile.name}
              </h2>
              <p className="mt-2 text-base font-bold text-cyan-brand">{profile.role}</p>
              <p className="mt-3 max-h-28 overflow-y-auto text-sm leading-6 text-ice/88">{profile.bio}</p>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
