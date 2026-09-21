import { Link } from 'react-router-dom';
import type { Category } from '@/types/menu';

interface CategoryNavProps {
  categories: Category[];
  activeSlug?: string;
  hasHeader?: boolean;
}

export default function CategoryNav({ categories, activeSlug, hasHeader = true }: CategoryNavProps) {
  return (
    <nav className={`${hasHeader ? 'top-16 sm:top-20' : 'top-0'} sticky z-30 bg-charcoal-800/95 backdrop-blur-sm border-b border-charcoal-700/30`}>
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5 overflow-x-auto no-scrollbar py-3 -mx-1">
          {categories.map((cat) => {
            const isActive = activeSlug === cat.slug;
            return (
              <Link
                key={cat.id}
                to={`/menu/${cat.slug}`}
                className={`
                  flex-shrink-0 text-sm font-medium whitespace-nowrap transition-colors duration-200 relative py-1
                  ${isActive
                    ? 'text-avocado-400'
                    : 'text-cream-100/45 hover:text-cream-100/80'
                  }
                `}
              >
                {cat.name}
                {isActive && (
                  <span className="absolute -bottom-px left-0 right-0 h-px bg-avocado-500" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
