import type { Ingredient, DietaryTag, Allergen } from '@/types/menu';
import { Leaf, AlertTriangle } from 'lucide-react';

interface InfoSectionsProps {
  ingredients: Ingredient[];
  dietaryTags: DietaryTag[];
  allergens: Allergen[];
  description: string | null;
}

export default function InfoSections({
  ingredients,
  dietaryTags,
  allergens,
  description,
}: InfoSectionsProps) {
  return (
    <div className="space-y-10">
      {/* Ingredients */}
      {(ingredients.length > 0 || description) && (
        <div className="animate-fade-in">
          <h2 className="text-cream-100/40 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Ingredients
          </h2>
          {description && (
            <p className="text-cream-100/70 text-sm sm:text-base leading-relaxed mb-4">
              {description}
            </p>
          )}
          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ing) => (
                <span
                  key={ing.id}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-charcoal-700/40 border border-charcoal-600/20 text-cream-100/70 text-sm font-medium"
                >
                  {ing.ingredient_name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dietary Information */}
      {dietaryTags.length > 0 && (
        <div className="animate-fade-in">
          <h2 className="text-cream-100/40 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Dietary Information
          </h2>
          <div className="flex flex-wrap gap-2">
            {dietaryTags.map((d) => (
              <span
                key={d.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-avocado-500/10 border border-avocado-500/20 text-avocado-300 text-sm font-medium"
              >
                <Leaf className="w-3.5 h-3.5" />
                {d.tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Allergen Information */}
      {allergens.length > 0 && (
        <div className="animate-fade-in">
          <h2 className="text-cream-100/40 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Allergen Information
          </h2>
          <div className="flex flex-wrap gap-2">
            {allergens.map((a) => (
              <span
                key={a.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/5 border border-amber-500/15 text-amber-400/80 text-sm font-medium"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {a.allergen}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
