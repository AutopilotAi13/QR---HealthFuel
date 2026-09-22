import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import { LoadingState, ErrorState, NotFoundState } from '@/components/StateViews';
import NutritionSnapshot from '@/components/nutrition/NutritionSnapshot';
import MacroBreakdown from '@/components/nutrition/MacroBreakdown';
import MicronutrientList from '@/components/nutrition/MicronutrientList';
import ServingSelector from '@/components/nutrition/ServingSelector';
import InfoSections from '@/components/nutrition/InfoSections';
import BottomNote from '@/components/nutrition/BottomNote';
import { getMenuItemBySlug, computeNutrition, computeMicronutrients, getDefaultServing } from '@/services/menuService';
import type { MenuItemWithRelations, Serving, ComputedNutrition, ComputedMicronutrient } from '@/types/menu';

export default function ItemDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<MenuItemWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [selectedServing, setSelectedServing] = useState<Serving | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    setNotFound(false);

    getMenuItemBySlug(slug!)
      .then((data) => {
        if (!active) return;
        setItem(data);
        if (data) setSelectedServing(getDefaultServing(data));
        else setNotFound(true);
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError(true);
          setLoading(false);
        }
      });

    return () => { active = false; };
  }, [slug]);

  // Compute nutrition for selected serving
  const computedNutrition: ComputedNutrition | null =
    item && selectedServing ? computeNutrition(item, selectedServing) : null;
  const computedMicros: ComputedMicronutrient[] =
    item && selectedServing ? computeMicronutrients(item, selectedServing) : [];

  if (loading) return (
    <div className="min-h-screen">
      <Header showBack />
      <LoadingState message="Loading nutrition details..." />
    </div>
  );

  if (error) return (
    <div className="min-h-screen">
      <Header showBack />
      <ErrorState />
    </div>
  );

  if (notFound || !item || !computedNutrition) return (
    <div className="min-h-screen">
      <Header showBack />
      <NotFoundState
        title="Item not found"
        message="This menu item doesn't exist or may have been removed."
      />
    </div>
  );

  return (
    <div className="min-h-screen">
      <Header showBack />

      <main className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Title block */}
        <div className="animate-slide-up mb-8">
          {item.category && (
            <p className="text-avocado-400 text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              {item.category.name}
            </p>
          )}
          <h1 className="text-cream-50 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            {item.name}
          </h1>
          {item.description && (
            <p className="text-cream-100/50 text-base sm:text-lg mt-2 leading-relaxed">
              {item.description}
            </p>
          )}
          <p className="text-cream-50 text-2xl font-bold mt-4">
            ₹{item.servings.length > 1 ? (selectedServing?.price ?? item.price) : item.price}
          </p>
        </div>

        {/* Optional image */}
        {item.image_url && (
          <div className="mb-8 rounded-2xl overflow-hidden bg-charcoal-700 animate-fade-in">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-48 sm:h-64 object-cover"
            />
          </div>
        )}

        {/* Nutrition sections */}
        <div className="space-y-10 sm:space-y-12">
          <NutritionSnapshot nutrition={computedNutrition} />

          {item.servings.length > 1 && selectedServing && (
            <ServingSelector
              servings={item.servings}
              selectedId={selectedServing.id}
              onSelect={setSelectedServing}
            />
          )}

          <MacroBreakdown nutrition={computedNutrition} />

          {computedMicros.length > 0 && (
            <MicronutrientList micronutrients={computedMicros} />
          )}

          <InfoSections
            ingredients={item.ingredients}
            dietaryTags={item.dietary_tags}
            allergens={item.allergens}
            description={item.description}
          />
        </div>

        <BottomNote />
      </main>
    </div>
  );
}
