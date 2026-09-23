import { Link } from 'react-router-dom';
import type { Category } from '@/types/menu';
import {
  MealsIcon,
  SaladsIcon,
  ProteinBowlsIcon,
  SproutBowlsIcon,
  ProteinSandwichesIcon,
  SmoothieIcon,
  CornIcon,
  DrinksIcon,
  DessertBarIcon,
  DetoxShotIcon,
  DefaultCategoryIcon,
} from '@/components/icons/CategoryIcons';
import type { SVGProps } from 'react';

type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const categoryIconMap: Array<{ match: string; Icon: IconComponent }> = [
  { match: 'meal', Icon: MealsIcon },
  { match: 'salad', Icon: SaladsIcon },
  { match: 'protein bowl', Icon: ProteinBowlsIcon },
  { match: 'sprout bowl', Icon: SproutBowlsIcon },
  { match: 'protein sandwich', Icon: ProteinSandwichesIcon },
  { match: 'sandwich', Icon: ProteinSandwichesIcon },
  { match: 'smoothie', Icon: SmoothieIcon },
  { match: 'corn', Icon: CornIcon },
  { match: 'drink', Icon: DrinksIcon },
  { match: 'dessert', Icon: DessertBarIcon },
  { match: 'no-bake', Icon: DessertBarIcon },
  { match: 'detox', Icon: DetoxShotIcon },
  { match: 'shot', Icon: DetoxShotIcon },
];

function getCategoryIcon(category: Category): IconComponent {
  const label = `${category.name} ${category.slug}`.toLowerCase();
  return categoryIconMap.find(({ match }) => label.includes(match))?.Icon ?? DefaultCategoryIcon;
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
        <div className="flex items-start justify-between gap-5 sm:gap-8 overflow-x-auto no-scrollbar py-3 sm:py-4">
          {categories.map((cat) => {
            const isActive = activeSlug === cat.slug;
            const Icon = getCategoryIcon(cat);
            return (
              <Link
                key={cat.id}
                to={`/menu/${cat.slug}`}
                className="flex min-w-[68px] flex-shrink-0 flex-col items-center gap-2 group"
              >
                <span
                  className={`
                    flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full transition-all duration-200
                    ${isActive
                      ? 'bg-avocado-500 text-charcoal-900'
                      : 'text-cream-100/65 group-hover:text-cream-50'
                    }
                  `}
                >
                  <Icon className="w-6 h-6" />
                </span>
                <span
                  className={`
                    text-[0.68rem] sm:text-xs text-center font-medium leading-tight whitespace-nowrap transition-colors duration-200 relative pb-2
                    ${isActive
                      ? 'text-cream-50'
                      : 'text-cream-100/65 group-hover:text-cream-50'
                    }
                  `}
                >
                  {cat.name}
                  {isActive && (
                    <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-avocado-400" />
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
