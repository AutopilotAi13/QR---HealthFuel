import type { ComputedNutrition } from '@/types/menu';

interface NutritionSnapshotProps {
  nutrition: ComputedNutrition;
}

export default function NutritionSnapshot({ nutrition }: NutritionSnapshotProps) {
  const macros = [
    { label: 'Calories', value: nutrition.calories, unit: 'kcal' },
    { label: 'Protein', value: nutrition.protein, unit: 'g' },
    { label: 'Carbs', value: nutrition.carbohydrates, unit: 'g' },
    { label: 'Fat', value: nutrition.fat, unit: 'g' },
    { label: 'Fiber', value: nutrition.fiber, unit: 'g' },
  ];

  return (
    <div className="animate-slide-up">
      <h2 className="text-cream-100/40 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
        Nutrition Snapshot
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-charcoal-700/30 rounded-xl overflow-hidden">
        {macros.map((m) => (
          <div
            key={m.label}
            className="bg-charcoal-800 px-4 py-5 sm:py-6 flex flex-col items-center justify-center text-center"
          >
            <span className="text-cream-100/40 text-xs font-medium uppercase tracking-wider mb-2">
              {m.label}
            </span>
            <span className="text-cream-50 text-2xl sm:text-3xl font-bold tabular-nums">
              {m.value}
            </span>
            <span className="text-cream-100/30 text-xs mt-1">{m.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
