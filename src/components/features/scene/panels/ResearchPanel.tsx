import Image from 'next/image';
import { researchData } from '@/content/research';

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return (
        <strong key={i} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

interface ResearchPanelProps {
  researchId: string;
}

export function ResearchPanel({ researchId }: ResearchPanelProps) {
  const entry = researchData.find((r) => r.id === researchId) ?? researchData[0];
  if (!entry) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Image */}
      {entry.heroImage && (
        <div className="relative aspect-video w-full overflow-hidden border border-white/20 bg-black/40">
          <Image
            src={entry.heroImage}
            alt={entry.title}
            fill
            className="object-cover"
            sizes="800px"
          />
        </div>
      )}

      {/* Title */}
      <h3 className="font-mono text-xl font-bold tracking-wide text-white">{entry.title}</h3>

      {/* Body */}
      <div
        className="text-sm leading-relaxed text-white/70"
        style={{ fontFamily: 'Times New Roman, serif' }}
      >
        {entry.body.split('\n').map((line, i) => {
          const trimmed = line.trim();

          if (trimmed === '' || trimmed === '---') return <div key={i} className="h-4" />;

          // ## Heading 2
          if (trimmed.startsWith('## ')) {
            return (
              <h4
                key={i}
                className="mb-2 mt-6 font-mono text-base font-bold tracking-wide text-white"
              >
                {trimmed.replace(/^## /, '')}
              </h4>
            );
          }

          // # Heading 1
          if (trimmed.startsWith('# ')) {
            return (
              <h3
                key={i}
                className="mb-2 mt-6 font-mono text-lg font-bold tracking-wide text-white"
              >
                {trimmed.replace(/^# /, '')}
              </h3>
            );
          }

          // > Blockquote
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote key={i} className="border-l-2 border-white/30 pl-4 italic text-white/50">
                {renderInline(trimmed.replace(/^> /, ''))}
              </blockquote>
            );
          }

          // * List item
          if (trimmed.startsWith('* ')) {
            return (
              <li key={i} className="ml-6 list-disc">
                {renderInline(trimmed.replace(/^\* /, ''))}
              </li>
            );
          }

          // Regular paragraph
          return (
            <p key={i} className="indent-4 sm:indent-8">
              {renderInline(trimmed)}
            </p>
          );
        })}
      </div>
    </div>
  );
}
