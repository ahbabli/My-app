import { useMemo, useState } from 'react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { TbArrowLeft } from 'react-icons/tb';

const iconClass = 'h-6 w-6';
const CONTACT_EMAIL = 'ahbabli77@gmail.com';

export default function ContactPage({ profile }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const socials = useSocialLinks(profile);

  function handleSubmit(event) {
    event.preventDefault();

    const subject = encodeURIComponent(`Portfolio message from ${form.name || 'a visitor'}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <main className="min-h-screen bg-ink px-0 py-0 text-white antialiased sm:px-6 sm:py-8 lg:grid lg:place-items-center lg:px-10">
      <section className="mx-auto w-full max-w-[402px] bg-ink px-5 pb-8 pt-6 shadow-2xl shadow-black/30 sm:rounded-[28px] sm:px-[35px] sm:pb-[42px] sm:pt-[48px] lg:max-w-[780px] lg:rounded-[36px] lg:px-12 lg:py-12">
        <a
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-mist transition hover:border-cyan-brand hover:bg-cyan-brand hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-brand"
          href="/"
          aria-label="Back to portfolio"
        >
          <TbArrowLeft className="h-5 w-5" aria-hidden="true" />
        </a>

        <div className="mt-8 lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
          <div>
            <p className="font-filter text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-brand">Contact</p>
            <h1 className="mt-3 text-[34px] font-bold leading-[0.98] text-white sm:text-[42px]">Send a message</h1>
            <p className="mt-4 text-sm leading-relaxed text-mist">
              The message will be prepared for {CONTACT_EMAIL}.
            </p>

            <div className="mt-6 flex gap-2">
              {socials.map((social) => (
                <a
                  className="grid h-12 w-12 place-items-center rounded-[9px] border border-white/10 bg-white/[0.04] text-cyan-brand transition hover:border-cyan-brand hover:bg-cyan-brand hover:text-white"
                  href={social.page}
                  key={social.label}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <form className="mt-8 grid gap-3 lg:mt-0" onSubmit={handleSubmit}>
            <ContactField label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />
            <ContactField label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} required />
            <label className="grid gap-2 text-sm font-bold text-white">
              Message
              <textarea
                className="min-h-[150px] resize-y rounded-[9px] border border-white/10 bg-[#080a12] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-brand"
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                placeholder="Tell me about your project..."
                required
              />
            </label>

            <button className="mt-1 inline-flex min-h-11 items-center justify-center rounded-[9px] bg-cyan-brand px-5 text-sm font-bold text-white transition hover:bg-mist hover:text-ink" type="submit">
              Send email
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export function SocialPage({ profile, type }) {
  const socials = useSocialLinks(profile);
  const social = socials.find((item) => item.id === type) ?? socials[0];

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4 py-10 text-white antialiased">
      <section className="w-full max-w-[560px] rounded-[8px] border border-white/10 bg-[#080a12] p-6 text-center shadow-2xl shadow-black/30 sm:p-8">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-[8px] bg-cyan-brand/15 text-cyan-brand">{social.iconLarge}</div>
        <p className="mt-6 font-filter text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-brand">{social.label}</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-white">{social.heading}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mist">{social.description}</p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a className="inline-flex min-h-11 items-center justify-center rounded-[8px] bg-cyan-brand px-5 text-sm font-bold text-white transition hover:bg-mist hover:text-ink" href={social.href} target="_blank" rel="noreferrer">
            Open {social.label}
          </a>
          <a className="inline-flex min-h-11 items-center justify-center rounded-[8px] border border-white/10 px-5 text-sm font-bold text-white/72 transition hover:border-cyan-brand hover:text-white" href="/contact">
            Contact page
          </a>
        </div>
      </section>
    </main>
  );
}

function ContactField({ label, value, onChange, type = 'text', required = false }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-white">
      {label}
      <input
        className="rounded-[9px] border border-white/10 bg-[#080a12] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-brand"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </label>
  );
}

function useSocialLinks(profile) {
  return useMemo(() => {
    const username = (profile.handle ?? '@ahbabli').replace('@', '');
    const whatsappText = encodeURIComponent(`Hi ${profile.name}, I want to talk about a project.`);

    return [
      {
        id: 'instagram',
        label: 'Instagram',
        page: '/instagram',
        href: `https://www.instagram.com/${username}`,
        heading: 'Instagram portfolio updates',
        description: 'See design shots, process posts, and visual experiments.',
        icon: <FaInstagram className={iconClass} aria-hidden="true" />,
        iconLarge: <FaInstagram className="h-9 w-9" aria-hidden="true" />,
      },
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        page: '/whatsapp',
        href: `https://wa.me/message/LCGGGKVER4UAK1`,
        heading: 'Start a WhatsApp message',
        description: 'Use WhatsApp for fast project questions and short briefs.',
        icon: <FaWhatsapp className={iconClass} aria-hidden="true" />,
        iconLarge: <FaWhatsapp className="h-9 w-9" aria-hidden="true" />,
      },
      {
        id: 'x',
        label: 'X / Twitter',
        page: '/x',
        href: `https://x.com/${username}`,
        heading: 'Follow on X',
        description: 'Find quick notes, launches, and product design thoughts.',
        icon: <FaXTwitter className={iconClass} aria-hidden="true" />,
        iconLarge: <FaXTwitter className="h-9 w-9" aria-hidden="true" />,
      },
    ];
  }, [profile.handle, profile.name]);
}
