import { Search, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search meals, bowls, salads...',
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on mount for quick mobile search
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="relative w-full">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-100/30 pointer-events-none">
        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-charcoal-700/60 border border-charcoal-600/40 rounded-xl pl-11 pr-10 py-3 sm:py-3.5 text-cream-50 placeholder:text-cream-100/30 text-sm sm:text-base font-medium transition-all focus:border-avocado-500/40 focus:bg-charcoal-700/80"
        aria-label="Search menu"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-100/30 hover:text-cream-100/70 transition-colors p-1"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
