import About from './About.jsx';
import ProfileHeader from './ProfileHeader.jsx';
import Skills from './Skills.jsx';
import Stats from './Stats.jsx';

export default function ProfileSurface({ profile }) {
  return (
    <article className="relative w-full max-w-[402px] overflow-hidden bg-ink px-5 pb-8 pt-6 shadow-2xl shadow-black/30 sm:my-8 sm:rounded-[28px] sm:border sm:border-white/[0.06] sm:px-[35px] sm:pb-[54px] sm:pt-[65px] lg:grid lg:min-h-[680px] lg:max-w-[1120px] lg:grid-cols-[360px_1fr] lg:gap-x-16 lg:rounded-[36px] lg:px-12 lg:py-14">
      <ProfileHeader profile={profile} />

      <div className="lg:pt-8">
        <Stats stats={profile.stats} />
        <About profile={profile} />
        <Skills skills={profile.skills} />
      </div>
    </article>
  );
}
