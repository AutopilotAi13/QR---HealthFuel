import { BRAND } from '@/types/menu';
import { Droplet } from 'lucide-react';

export default function BottomNote() {
  return (
    <div className="mt-12 pt-8 border-t border-charcoal-700/30 space-y-3">
      <div className="flex items-center gap-2 text-avocado-400">
        <Droplet className="w-4 h-4" />
        <p className="text-sm font-medium text-cream-100/80">{BRAND.bottomNote}</p>
      </div>
      <p className="text-cream-100/30 text-xs leading-relaxed max-w-md">
        {BRAND.nutritionDisclaimer}
      </p>
      <p className="text-cream-100/25 text-xs">
        Nutrition information last updated: {BRAND.lastUpdated}
      </p>
    </div>
  );
}
