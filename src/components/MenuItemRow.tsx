import { Link } from 'react-router-dom';
import { ChevronRight, Flame } from 'lucide-react';
import type { MenuItemWithRelations } from '@/types/menu';

interface MenuItemRowProps {
  item: MenuItemWithRelations;
}

export default function MenuItemRow({ item }: MenuItemRowProps) {
  const previewNutrition = item.nutrition[0];
  const dietaryTags = item.dietary_tags.slice(0, 2);

  const prices = item.servings.map((s) => s.price).filter((p): p is number => p !== null);
  const minPrice = prices.length > 0 ? Math.min(...prices) : item.price;
  const maxPrice = prices.length > 1 ? Math.max(...prices) : null;
  const priceLabel = maxPrice !== null ? `₹${minPrice} – ₹${maxPrice}` : `₹${minPrice}`;

  const categorySlug = item.category?.slug ?? '';

  return (
      <Link
        to={`/menu/${categorySlug}/${item.slug}`}
        className="group flex items-start gap-3 sm:gap-4 py-4 sm:py-5 border-b border-charcoal-700/30 hover:border-avocado-500/20 transition-colors duration-200"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-cream-50 font-medium text-base sm:text-lg leading-tight group-hover:text-avocado-300 transition-colors">
              {item.name}
            </h3>
            <span className="text-cream-50 font-semibold text-sm sm:text-base flex-shrink-0">
              {priceLabel}
            </span>
          </div>

          {item.description && (
            <p className="text-cream-100/40 text-xs sm:text-sm mt-1 leading-relaxed">
              {item.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2.5 flex-wrap">
            {previewNutrition && (
              <span className="inline-flex items-center gap-1 text-cream-100/50 text-xs">
                <Flame className="w-3 h-3 text-avocado-400/60" />
                {previewNutrition.calories} kcal
              </span>
            )}
            {previewNutrition && (
              <span className="text-cream-100/30 text-xs">
                {previewNutrition.protein}g protein
              </span>
            )}
            {dietaryTags.map((d) => (
              <span
                key={d.id}
                className="text-avocado-300/70 text-2xs font-medium uppercase tracking-wider"
              >
                {d.tag}
              </span>
            ))}
          </div>
        </div>

        {item.image_url && (
          <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-charcoal-700">
            <img
              src={item.image_url}
              alt={item.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <ChevronRight className="w-4 h-4 text-cream-100/20 group-hover:text-avocado-400 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 mt-1" />
      </Link>
  );
}
