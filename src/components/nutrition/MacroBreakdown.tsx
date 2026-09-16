import type { ComputedNutrition } from '@/types/menu';

interface MacroBreakdownProps {
  nutrition: ComputedNutrition;
}

export default function MacroBreakdown({ nutrition }: MacroBreakdownProps) {
  // Calculate macro percentages by calories (protein/carb/fat = 4/4/9 kcal per gram)
  const proteinCal = nutrition.protein * 4;
  const carbCal = nutrition.carbohydrates * 4;
  const fatCal = nutrition.fat * 9;
  const totalMacroCal = proteinCal + carbCal + fatCal;

  const macros = [
    { label: 'Protein', value: nutrition.protein, unit: 'g', cals: proteinCal, color: 'bg-avocado-500' },
    { label: 'Carbohydrates', value: nutrition.carbohydrates, unit: 'g', cals: carbCal, color: 'bg-avocado-300' },
    { label: 'Fat', value: nutrition.fat, unit: 'g', cals: fatCal, color: 'bg-avocado-700' },
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-cream-100/40 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
        Macronutrients
      </h2>

      {/* Visual bar */}
      {totalMacroCal > 0 && (
        <div className="flex h-2.5 rounded-full overflow-hidden mb-6 bg-charcoal-700/50">
          {macros.map((m) => (
            <div
              key={m.label}
              className={m.color}
              style={{ width: `${(m.cals / totalMacroCal) * 100}%` }}
              title={`${m.label}: ${m.value}${m.unit}`}
            />
          ))}
        </div>
      )}

      {/* Full macro list */}
      <div className="space-y-px bg-charcoal-700/20 rounded-xl overflow-hidden">
        {[
          { label: 'Calories', value: nutrition.calories, unit: 'kcal' },
          { label: 'Protein', value: nutrition.protein, unit: 'g' },
          { label: 'Carbohydrates', value: nutrition.carbohydrates, unit: 'g' },
          { label: 'Fat', value: nutrition.fat, unit: 'g' },
          { label: 'Fiber', value: nutrition.fiber, unit: 'g' },
          { label: 'Sugar', value: nutrition.sugar, unit: 'g' },
          { label: 'Sodium', value: nutrition.sodium, unit: 'mg' },
        ].map((m) => (
          <div
            key={m.label}
            className="flex items-center justify-between bg-charcoal-800 px-4 py-3"
          >
            <span className="text-cream-100/60 text-sm font-medium">{m.label}</span>
            <span className="text-cream-50 text-sm font-semibold tabular-nums">
              {m.value}
              <span className="text-cream-100/40 font-normal ml-1">{m.unit}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
