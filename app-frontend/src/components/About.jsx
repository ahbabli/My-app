export default function About({ profile }) {
  return (
    <section className="mt-7 lg:mt-16">
      <h2 className="text-[22px] font-bold leading-[1.15] text-ice sm:text-[23px] lg:text-[34px]">{profile.role}</h2>
      <p className="mt-3 max-w-[540px] text-[13px] leading-snug text-mist sm:mt-5 sm:text-[14px] lg:text-[19px] lg:leading-snug">
        {profile.bio}
      </p>
    </section>
  );
}
