import type { Serving } from '@/types/menu';

interface ServingSelectorProps {
  servings: Serving[];
  selectedId: string;
  onSelect: (serving: Serving) => void;
}

export default function ServingSelector({
  servings,
  selectedId,
  onSelect,
}: ServingSelectorProps) {
  if (servings.length <= 1) return null;

  return (
    <div className="animate-fade-in">
      <h2 className="text-cream-100/40 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
        Serving Size
      </h2>
      <div className="inline-flex p-1 bg-charcoal-700/40 rounded-xl border border-charcoal-600/20">
        {servings.map((s) => {
          const isActive = s.id === selectedId;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className={`
                px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-avocado-500 text-cream-50 shadow-sm'
                  : 'text-cream-100/50 hover:text-cream-50'
                }
              `}
            >
              {s.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
