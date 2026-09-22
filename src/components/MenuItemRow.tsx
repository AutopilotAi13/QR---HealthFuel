import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import type { MenuItemWithRelations } from '@/types/menu';

interface MenuItemRowProps {
  item: MenuItemWithRelations;
}

export default function MenuItemRow({ item }: MenuItemRowProps) {
  const previewNutrition = item.nutrition[0];

  const prices = item.servings.map((s) => s.price).filter((p): p is number => p !== null);
  const hasMultipleServings = item.servings.length > 1 && prices.length > 1;

  const categorySlug = item.category?.slug ?? '';

  return (
    <Link
      to={`/menu/${categorySlug}/${item.slug}`}
      className="group flex items-start gap-3 py-4 border-b border-charcoal-700/20 hover:border-avocado-500/20 transition-colors duration-200 active:bg-charcoal-700/20 -mx-4 px-4 sm:mx-0 sm:px-0 rounded-lg sm:rounded-none"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-cream-50 font-semibold text-base sm:text-lg leading-tight group-hover:text-avocado-300 transition-colors duration-200">
            {item.name}
          </h3>
          <span className="text-cream-50 font-semibold text-sm sm:text-base flex-shrink-0 tabular-nums">
            {hasMultipleServings ? (
              <span className="flex flex-col items-end leading-tight">
                <span>₹{Math.min(...prices)}</span>
                <span className="text-cream-100/40 text-2xs font-normal">– ₹{Math.max(...prices)}</span>
              </span>
            ) : (
              `₹${item.price}`
            )}
          </span>
        </div>

        {item.description && (
          <p className="text-cream-100/40 text-xs sm:text-sm mt-1 leading-relaxed">
            {item.description}
          </p>
        )}

        {hasMultipleServings && (
          <div className="flex items-center gap-2 mt-2">
            {item.servings.map((s, i) => (
              <span key={s.id} className="inline-flex items-center text-cream-100/35 text-2xs font-medium uppercase tracking-wider">
                {s.name}
                <span className="text-cream-100/50 ml-1">₹{s.price}</span>
                {i < item.servings.length - 1 && <span className="text-charcoal-600 ml-2">·</span>}
              </span>
            ))}
          </div>
        )}

        {previewNutrition && (
          <div className="flex items-center gap-2 mt-2">
            <Flame className="w-3 h-3 text-avocado-400/50 flex-shrink-0" />
            <span className="text-cream-100/35 text-xs sm:text-2xs">
              {previewNutrition.calories} kcal
              <span className="text-charcoal-600 mx-1.5">·</span>
              {previewNutrition.protein}g protein
              <span className="text-charcoal-600 mx-1.5">·</span>
              {previewNutrition.fiber}g fiber
            </span>
          </div>
        )}
      </div>

      <span className="text-cream-100/20 group-hover:text-avocado-400 transition-colors duration-200 flex-shrink-0 mt-1 text-2xs font-medium uppercase tracking-wider hidden sm:block">
        Details
      </span>
    </Link>
  );
}
