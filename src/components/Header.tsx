import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';
import monogram from '@/assets/HF_Monogram.png';

interface HeaderProps {
  showBack?: boolean;
}

export default function Header({ showBack = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-charcoal-800/95 backdrop-blur-sm border-b border-charcoal-700/40">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 sm:h-20">
          {showBack && (
            <Link
              to="/menu"
              className="flex items-center justify-center w-9 h-9 -ml-2 text-cream-100/60 hover:text-avocado-400 transition-colors flex-shrink-0"
              aria-label="Back to menu"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <Link to="/menu" className="flex items-center gap-2.5 sm:gap-4 group mx-auto">
            <img
              src={monogram}
              alt="Health Fuel monogram"
              className="w-[44px] sm:w-[60px] h-auto flex-shrink-0 object-contain"
            />
            <div className="min-w-0 text-center">
              <span className="font-bold text-lg sm:text-2xl tracking-tight leading-none whitespace-nowrap">
                <span className="text-avocado-500">Health</span>{' '}
                <span className="text-cream-100">Fuel</span>
              </span>
              <p className="text-cream-100 text-[0.5rem] sm:text-[0.65rem] font-semibold tracking-[0.18em] sm:tracking-[0.22em] uppercase mt-1 whitespace-nowrap">
                Curated Nutrition. Crafted Fresh.
              </p>
              <div className="flex items-center justify-center gap-2 mt-1.5">
                <span className="h-px w-8 sm:w-14 bg-avocado-500" />
                <Leaf className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-avocado-500" strokeWidth={1.5} />
                <span className="h-px w-8 sm:w-14 bg-avocado-500" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
