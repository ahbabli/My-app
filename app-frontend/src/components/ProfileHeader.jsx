import { asset } from '../utils/assets.js';

export default function ProfileHeader({ profile }) {
  return (
    <header className="grid grid-cols-[108px_1fr] items-center gap-5 sm:block lg:flex lg:flex-col lg:justify-center">
      <div className="relative h-[104px] w-[104px] sm:h-[166px] sm:w-[166px] lg:h-[220px] lg:w-[220px]">
        <img className="absolute inset-0 h-full w-full" src={asset('avatar-ring.svg')} alt="" />
        <img
          className="absolute left-[3px] top-0.5 h-[101px] w-[101px] sm:left-1 sm:top-[3px] sm:h-[162px] sm:w-[162px] lg:h-[214px] lg:w-[214px]"
          src={asset('avatar.png')}
          alt={`Illustrated avatar of ${profile.name}`}
        />
      </div>

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
    </header>
  );
}
