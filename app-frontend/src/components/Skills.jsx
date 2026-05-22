import { asset } from '../utils/assets.js';

export default function Skills({ skills }) {
  return (
    <section id="skills" className="mt-7 flex items-start justify-between gap-3 lg:mt-20 lg:max-w-[580px]" aria-label="Skills">
      {skills.map((skill) => (
        <article className="flex min-w-0 flex-1 flex-col items-center gap-2 lg:w-36 lg:flex-none lg:gap-5" key={skill.label}>
          <div className="relative grid h-16 w-16 place-items-center sm:h-[78px] sm:w-[78px] lg:h-24 lg:w-24">
            {skill.icon === 'graphic-icon.svg' ? (
              <img className="h-16 w-16 sm:h-[78px] sm:w-[78px] lg:h-24 lg:w-24" src={asset(skill.icon)} alt="" />
            ) : (
              <>
                <img className="absolute inset-0 h-full w-full" src={asset('skill-circle.svg')} alt="" />
                <img className={`${skill.iconClass} relative z-10 scale-[0.82] sm:scale-100 lg:scale-125`} src={asset(skill.icon)} alt="" />
              </>
            )}
          </div>
          <h3 className="max-w-full truncate text-center text-[12px] font-normal leading-[1.15] text-white sm:text-[14px] lg:text-base">
            {skill.label}
          </h3>
        </article>
      ))}
    </section>
  );
}
