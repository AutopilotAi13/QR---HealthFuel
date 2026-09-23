import { Link } from 'react-router-dom';
import { Target, BarChart3, UtensilsCrossed, ArrowRight, Sparkles } from 'lucide-react';

export default function PersonalizedNutritionBanner() {
  const points = [
    { icon: Target, text: 'Tailored to your goals' },
    { icon: BarChart3, text: 'Backed by nutrition data' },
    { icon: UtensilsCrossed, text: 'Only Health Fuel menu items' },
  ];

  return (
    <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 pb-6 animate-fade-in">
      <Link
        to="/personalized-nutrition"
        className="block group relative overflow-hidden rounded-2xl border border-avocado-500/50 bg-cream-50 transition-all duration-300 hover:border-avocado-400"
      >
        <div className="absolute inset-y-0 right-0 hidden w-[30%] bg-avocado-900 sm:block" />
        <div className="absolute right-[9%] top-1/2 hidden h-44 w-44 -translate-y-1/2 rounded-full border border-avocado-300/20 sm:block" />
        <div className="absolute right-[12%] top-1/2 hidden h-28 w-28 -translate-y-1/2 rounded-full border border-avocado-300/15 sm:block" />

        <div className="relative p-5 sm:p-8">
          <div className="sm:max-w-[68%]">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal-900 text-cream-50 text-2xs font-bold tracking-[0.15em] uppercase">
                <Sparkles className="w-3 h-3 text-avocado-300" />
                Coming Soon
              </span>
            </div>

            <h2 className="text-charcoal-900 text-xl sm:text-3xl font-bold tracking-tight leading-tight">
              Personalized Nutrition
            </h2>
            <p className="text-avocado-700 text-sm sm:text-base font-semibold mt-1">
              Your food. Your goal.
            </p>
            <p className="text-charcoal-700 text-sm sm:text-base mt-2 leading-relaxed max-w-md">
              Get personalized Health Fuel meal recommendations based on your goal.
            </p>

            <span className="mt-4 inline-flex items-center gap-2 bg-avocado-500 group-hover:bg-avocado-400 text-cream-50 text-sm font-semibold rounded-xl px-5 py-3 transition-colors duration-200 whitespace-nowrap">
              Get Early Access
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-5 mt-4 sm:mt-5">
              {points.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.text} className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-avocado-100 border border-avocado-200 flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-avocado-700" strokeWidth={1.5} />
                    </span>
                    <span className="text-charcoal-700 text-xs sm:text-sm font-medium">
                      {p.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="absolute right-[5%] top-1/2 hidden -translate-y-1/2 text-center text-cream-50/80 sm:block sm:w-[20%]">
            <p className="text-sm italic leading-relaxed">A healthier<br />you is<br />coming soon.</p>
            <span className="mt-2 block text-avocado-300 text-2xl">⌁</span>
          </div>
        </div>
      </Link>
    </section>
  );
}
