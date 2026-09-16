import type { ComputedMicronutrient } from '@/types/menu';

interface MicronutrientListProps {
  micronutrients: ComputedMicronutrient[];
}

export default function MicronutrientList({ micronutrients }: MicronutrientListProps) {
  if (micronutrients.length === 0) return null;

  return (
    <div className="animate-fade-in">
      <h2 className="text-cream-100/40 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
        Micronutrients
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {micronutrients.map((m) => (
          <div
            key={m.nutrient_name}
            className="bg-charcoal-700/30 border border-charcoal-600/20 rounded-xl px-4 py-3.5"
          >
            <span className="text-cream-100/40 text-xs font-medium uppercase tracking-wider block mb-1">
              {m.nutrient_name}
            </span>
            <span className="text-cream-50 text-lg font-semibold tabular-nums">
              {m.amount}
              <span className="text-cream-100/40 text-sm font-normal ml-1">{m.unit}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
