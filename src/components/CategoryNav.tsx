import { Link } from 'react-router-dom';
import type { Category } from '@/types/menu';

interface CategoryNavProps {
  categories: Category[];
  activeSlug?: string;
}

export default function CategoryNav({ categories, activeSlug }: CategoryNavProps) {
  return (
    <nav className="sticky top-16 sm:top-20 z-30 bg-charcoal-800/95 backdrop-blur-sm border-b border-charcoal-700/30">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-3 -mx-1">
          {categories.map((cat) => {
            const isActive = activeSlug === cat.slug;
            return (
              <Link
                key={cat.id}
                to={`/menu/${cat.slug}`}
                className={`
                  flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                  ${isActive
                    ? 'bg-avocado-500 text-cream-50'
                    : 'text-cream-100/50 hover:text-cream-50 hover:bg-charcoal-700/50'
                  }
                `}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
