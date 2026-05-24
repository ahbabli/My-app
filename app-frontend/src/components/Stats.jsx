export default function Stats({ stats }) {
  const links = {
    Projects: '#projects',
    Skills: '#skills',
  };

  return (
    <section className="mt-7 grid grid-cols-3 gap-2 rounded-[18px] border border-white/10 bg-white/[0.035] px-3 py-4 text-center sm:mt-[34px] sm:grid-cols-[80px_60px_92px] sm:gap-[30px] sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-left lg:mt-0 lg:grid-cols-3 lg:gap-8" aria-label="Portfolio statistics">
      {stats.map((stat) => (
        <a
          className="flex min-h-12 flex-col justify-center gap-[5px] px-[3px] transition hover:translate-y-[-2px] hover:text-cyan-brand"
          key={stat.label}
        >
          <strong className="text-[22px] font-bold leading-none text-white lg:text-[34px]">{stat.value}</strong>
          <span className="whitespace-nowrap text-[12px] uppercase leading-none text-mist sm:text-[15px] lg:text-[16px]">{stat.label}</span>
        </a>
      ))}
    </section>
  );
}
