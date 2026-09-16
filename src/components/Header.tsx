import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BRAND } from '@/types/menu';

interface HeaderProps {
  showBack?: boolean;
}

export default function Header({ showBack = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-charcoal-800/95 backdrop-blur-sm border-b border-charcoal-700/40">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
            {showBack && (
              <Link
                to="/menu"
                className="flex items-center justify-center w-9 h-9 -ml-2 text-cream-100/60 hover:text-avocado-400 transition-colors"
                aria-label="Back to menu"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}
            <Link to="/menu" className="flex items-center gap-3 group">
              <img
                src={BRAND.logoUrl}
                alt="Health Fuel"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-1 ring-avocado-500/20"
              />
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg tracking-tight leading-none">
                  <span className="text-avocado-500">Health</span>{' '}
                  <span className="text-cream-100">Fuel</span>
                </span>
                <span className="text-cream-100/40 text-2xs sm:text-[0.625rem] font-medium tracking-[0.15em] uppercase mt-1">
                  Curated Nutrition
                </span>
              </div>
            </Link>
          </div>
          <div className="hidden sm:block">
            <span className="text-cream-100/30 text-xs font-medium tracking-[0.2em] uppercase">
              Crafted Fresh
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
