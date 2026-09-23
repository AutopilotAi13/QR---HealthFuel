import { Link } from 'react-router-dom';
import type { Category } from '@/types/menu';
import {
  UtensilsCrossed,
  Salad,
  Soup,
  Sprout,
  Sandwich,
  GlassWater,
  CircleDot,
  CupSoda,
  Cookie,
  Syringe,
  type LucideIcon,
} from 'lucide-react';

const categoryIcons: Record<string, LucideIcon> = {
  meals: UtensilsCrossed,
  salads: Salad,
  'protein-bowls': Soup,
  'sprout-bowls': Sprout,
  'protein-sandwiches': Sandwich,
  smoothies: GlassWater,
  corn: CircleDot,
  drinks: CupSoda,
  'no-bake-dessert-bar': Cookie,
  'detox-shots': Syringe,
};

function getCategoryIcon(slug: string): LucideIcon {
  return categoryIcons[slug] ?? CircleDot;
}

interface CategoryNavProps {
  categories: Category[];
  activeSlug?: string;
  hasHeader?: boolean;
}

export default function CategoryNav({ categories, activeSlug, hasHeader = true }: CategoryNavProps) {
  return (
    <nav className={`${hasHeader ? 'top-16 sm:top-20' : 'top-0'} sticky z-30 bg-charcoal-800/95 backdrop-blur-sm border-b border-charcoal-700/30`}>
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-3 sm:py-4 -mx-1">
          {categories.map((cat) => {
            const isActive = activeSlug === cat.slug;
            const Icon = getCategoryIcon(cat.slug);
            return (
              <Link
                key={cat.id}
                to={`/menu/${cat.slug}`}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 group"
              >
                <span
                  className={`
                    flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl border transition-all duration-200
                    ${isActive
                      ? 'bg-avocado-500/15 border-avocado-500/30 text-avocado-300'
                      : 'bg-charcoal-700/30 border-charcoal-700/30 text-cream-100/40 group-hover:text-cream-100/70 group-hover:border-charcoal-600/40'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
                </span>
                <span
                  className={`
                    text-xs sm:text-sm font-medium whitespace-nowrap transition-colors duration-200 relative pb-1
                    ${isActive
                      ? 'text-avocado-300'
                      : 'text-cream-100/45 group-hover:text-cream-100/80'
                    }
                  `}
                >
                  {cat.name}
                  {isActive && (
                    <span className="absolute -bottom-px left-0 right-0 h-px bg-avocado-500" />
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
