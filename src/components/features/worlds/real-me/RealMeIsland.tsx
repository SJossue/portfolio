import Image from 'next/image';

import IslandSection from '@/components/features/worlds/shared/IslandSection';
import { aboutData } from '@/content/about';
import { contactLinks } from '@/content/contact';
import type { IslandSectionRef } from '@/components/features/worlds/shared/IslandShell';

const ACCENT = '16, 185, 129';

export const sections: IslandSectionRef[] = [
  { id: 'about', label: 'About Me' },
  { id: 'skills', label: 'Skills' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'connect', label: "Let's Connect" },
];

/** Descriptive alt text for the gallery photos (keyed by image path). */
const GALLERY_ALT: Record<string, string> = {
  '/jossue/crossed-headshots.jpg': 'Jossue Sarango — studio portrait',
  '/jossue/hands-headshot.jpg': 'Jossue Sarango — portrait',
  '/social/jossue-accord-photo-together.jpg': 'Jossue with his Honda Accord',
  '/social/jossue-accord-photo.jpg': 'Jossue standing beside his Honda Accord',
};

/**
 * About Me — the human behind the code. Primary (middle-panel) content: a lead
 * portrait + bio, the skills I work with, a gallery of moments, and the ways to
 * reach me. Built from `about` + `contact` content.
 */
export default function RealMeIsland() {
  const [lead, ...gallery] = aboutData.images;

  return (
    <div className="text-white">
      <IslandSection id="about" eyebrow="The human behind the code" title="About Me">
        <div className="border-white/8 relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-white/[0.03]">
          <Image
            src={lead}
            alt={aboutData.name}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-5">
          <h3 className="text-xl font-bold text-white">{aboutData.name}</h3>
          <p className="mt-1 text-sm">
            <span style={{ color: `rgb(${ACCENT})` }}>{aboutData.roleTitle}</span>
            <span className="text-white/40"> · </span>
            <span className="text-white/60">{aboutData.ethnicity}</span>
          </p>
        </div>

        <p className="mt-5 max-w-prose text-base leading-relaxed text-white/70">{aboutData.bio}</p>
      </IslandSection>

      <IslandSection id="skills" eyebrow="What I work with" title="Skills">
        <div className="grid gap-4 sm:grid-cols-2">
          {aboutData.skills.map((group) => (
            <div
              key={group.category}
              className="border-white/8 rounded-2xl border bg-white/[0.02] p-5"
            >
              <h3
                className="mb-3 font-mono text-xs font-bold uppercase tracking-wider"
                style={{ color: `rgb(${ACCENT})` }}
              >
                {group.category}
              </h3>
              <ul className="flex flex-wrap gap-1.5">
                {group.items.map((skill) => (
                  <li
                    key={skill}
                    className="border-white/8 rounded-lg border bg-white/[0.03] px-2.5 py-1 text-xs text-white/75"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </IslandSection>

      <IslandSection id="gallery" eyebrow="Moments" title="Gallery">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {gallery.map((src) => (
            <div
              key={src}
              className="border-white/8 relative aspect-square w-full overflow-hidden rounded-2xl border bg-white/[0.03]"
            >
              <Image
                src={src}
                alt={GALLERY_ALT[src] ?? aboutData.name}
                fill
                sizes="(min-width: 1024px) 13vw, 45vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </IslandSection>

      <IslandSection id="connect" eyebrow="Reach out" title="Let's Connect">
        <p className="max-w-prose text-base leading-relaxed text-white/70">
          I am always happy to talk shop — engineering, products, or the next thing worth building.
          Reach out through any of these and I will get back to you.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {contactLinks.map((link) => {
            const external = link.href.startsWith('http');
            return (
              <a
                key={link.id}
                href={link.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/[0.04]"
                style={{ borderColor: `rgba(${ACCENT}, 0.4)`, color: `rgb(${ACCENT})` }}
              >
                {link.label}
                <span aria-hidden>&rarr;</span>
              </a>
            );
          })}
        </div>
      </IslandSection>
    </div>
  );
}
