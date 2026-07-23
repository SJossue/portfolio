import HubSocials from '@/components/features/hub/HubSocials';
import type { ResourceItem, ResourceItemType, ResourceStage } from '@/content/resources';

export const WORLD_NAME = 'Resources';
export const WORLD_COLOR = '#f59e0b';
/** `r, g, b` triplet matching WORLD_COLOR — feeds `--world-color-rgb` and every
 *  `rgba(${ACCENT}, ...)` usage below. */
export const ACCENT = '245, 158, 11';

export const eyebrow = 'mb-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45';

const TYPE_LABELS: Record<ResourceItemType, string> = {
  program: 'Program',
  scholarship: 'Scholarship',
  fellowship: 'Fellowship',
  organization: 'Organization',
  tool: 'Tool',
  article: 'Article',
};

export function ResourceTypeBadge({ type }: { type: ResourceItemType }) {
  return (
    <span
      className="rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
      style={{ background: `rgba(${ACCENT}, 0.12)`, color: `rgb(${ACCENT})` }}
    >
      {TYPE_LABELS[type]}
    </span>
  );
}

export function TagChips({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li
          key={tag}
          className="border-white/8 rounded-lg border bg-white/[0.03] px-2.5 py-1 text-xs text-white/75"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

export function Socials() {
  return (
    <div className="mt-auto flex justify-center pt-2">
      <HubSocials accentColor={WORLD_COLOR} accentRgb={ACCENT} layout="inline" />
    </div>
  );
}

/** A stage tile shown on the hub view. The click behavior is added by the button
 *  that wraps this in ResourcesShell. */
export function StageCardBody({ stage }: { stage: ResourceStage }) {
  return (
    <div className="p-5">
      <p
        className="font-mono text-[10px] uppercase tracking-[0.3em]"
        style={{ color: `rgb(${ACCENT})` }}
      >
        {stage.subtitle}
      </p>
      <h3 className="mt-2 text-lg font-bold text-white">{stage.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/60">{stage.intro}</p>
      <span
        className="mt-4 inline-flex items-center gap-1 font-mono text-xs font-semibold"
        style={{ color: `rgb(${ACCENT})` }}
      >
        {stage.items.length} {stage.items.length === 1 ? 'resource' : 'resources'}{' '}
        <span aria-hidden>&rarr;</span>
      </span>
    </div>
  );
}

/** A resource card shown inside a stage view. The click behavior is added by the
 *  button that wraps this in ResourcesShell. */
export function ItemCardBody({ item }: { item: ResourceItem }) {
  return (
    <div className="p-5">
      <ResourceTypeBadge type={item.type} />
      <h3 className="mt-2 text-base font-bold text-white">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/60">{item.note}</p>
      {item.tags?.length ? (
        <div className="mt-3">
          <TagChips tags={item.tags} />
        </div>
      ) : null}
      <span
        className="mt-4 inline-flex items-center gap-1 font-mono text-xs font-semibold"
        style={{ color: `rgb(${ACCENT})` }}
      >
        Read more <span aria-hidden>&rarr;</span>
      </span>
    </div>
  );
}

export function ExternalLinkButton({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-xs font-semibold transition-colors"
      style={{ borderColor: `rgba(${ACCENT}, 0.4)`, color: `rgb(${ACCENT})` }}
    >
      Visit resource <span aria-hidden>&#8599;</span>
    </a>
  );
}
