
export default function Footer() {
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61578960871424",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.6V3.6c-.8-.1-1.6-.2-2.4-.2-2.4 0-4 1.5-4 4.2v2.3H7.6V13h2.7v8h3.2Z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/919310244970",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M12 2a9.8 9.8 0 0 0-8.4 14.8L2.3 22l5.4-1.4A9.8 9.8 0 1 0 12 2Zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-3.2.8.9-3.1-.2-.3A8 8 0 1 1 12 19.8Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8.9-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7 7 0 0 1-1.3-1.6c-.1-.2 0-.3.1-.4l.4-.5.3-.4c.1-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4 2.3.9 2.3.6 2.7.6.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.3-.2-.5-.3Z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/minimagic.skincare.india",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#F8F8F6]">
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
        <h2 className="font-serif italic text-3xl md:text-4xl text-[#1A1A1A]">
          Stay in touch
        </h2>

        <p className="mt-4 text-xs md:text-sm uppercase tracking-[0.35em] text-[#666666]">
          Contact Kandid Luxury
        </p>

        <div className="w-20 h-px bg-[#D8B67D] mx-auto my-8" />

        <div className="flex flex-wrap justify-center items-center gap-8">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Contact Kandid Luxury on ${social.name}`}
              className="flex items-center gap-2 text-sm text-[#555555] hover:text-[#B18A50] transition-colors"
            >
              {social.icon}
              <span>{social.name}</span>
            </a>
          ))}
        </div>

        <p className="mt-12 text-sm text-[#8A8A8A]">
          © {new Date().getFullYear()} Kandid Luxury. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
