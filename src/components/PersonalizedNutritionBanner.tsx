import { Link } from 'react-router-dom';
import { Target, BarChart3, UtensilsCrossed, ArrowRight, Sparkles, Leaf } from 'lucide-react';

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
        className="block group relative min-h-[330px] overflow-hidden rounded-2xl border border-avocado-500/60 bg-[#f4efdf] transition-all duration-300 hover:border-avocado-400"
      >
        <div className="absolute inset-y-0 right-0 hidden w-[43%] overflow-hidden bg-gradient-to-br from-[#ddd7bd] via-[#718649] to-[#263827] sm:block" />
        <div className="absolute inset-y-0 right-0 hidden w-[19%] bg-[#263827] sm:block" />

        {/* CSS-built food bowl artwork keeps the banner self-contained without adding an image asset. */}
        <div className="absolute right-[23%] top-1/2 hidden h-64 w-64 -translate-y-1/2 rounded-full bg-[#c5b98c] shadow-[0_20px_35px_rgba(19,31,21,0.35)] sm:block">
          <div className="absolute inset-3 rounded-full border-[14px] border-[#e4dec2] bg-[#687e43] shadow-inner" />
          <div className="absolute left-14 top-14 h-16 w-16 rounded-full bg-[#315035] opacity-90" />
          <div className="absolute right-12 top-12 h-12 w-12 rounded-full bg-[#a34831] opacity-90" />
          <div className="absolute left-20 bottom-16 h-14 w-9 rotate-45 rounded-lg bg-[#d1a46b] shadow-sm" />
          <div className="absolute right-20 bottom-16 h-14 w-9 -rotate-45 rounded-lg bg-[#deb578] shadow-sm" />
          <div className="absolute left-10 bottom-20 h-8 w-8 rounded-full bg-[#dfc26a]" />
          <div className="absolute right-10 bottom-20 h-7 w-7 rounded-full bg-[#e6cf7e]" />
          <Leaf className="absolute left-24 top-9 h-12 w-12 rotate-45 text-[#294c2f]" strokeWidth={1.5} />
          <div className="absolute inset-x-5 bottom-[-34px] h-24 rounded-[50%] border-4 border-[#d6cda9] bg-[#9c9167]" />
        </div>

        <div className="absolute right-[8%] top-1/2 hidden h-44 w-44 -translate-y-1/2 rounded-full border border-avocado-200/25 sm:block" />
        <div className="absolute right-[10%] top-1/2 hidden h-28 w-28 -translate-y-1/2 rounded-full border border-avocado-200/20 sm:block" />

        <div className="relative flex min-h-[330px] flex-col justify-center p-6 sm:max-w-[62%] sm:p-8 lg:p-10">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#263827] px-4 py-2 text-xs font-bold tracking-[0.12em] text-cream-50 uppercase">
              <Sparkles className="h-3.5 w-3.5 text-avocado-300" />
              Coming Soon
            </span>
          </div>

          <h2 className="text-[#171b16] text-2xl sm:text-4xl lg:text-[2.7rem] font-bold tracking-tight leading-[1.05]">
            Personalized Nutrition
          </h2>
          <p className="mt-2 text-[#263827] text-base sm:text-xl font-semibold">
            Your food. Your goal.
          </p>
          <p className="mt-2 max-w-[29rem] text-[#3f4939] text-sm sm:text-base lg:text-lg leading-relaxed">
            Get personalized Health Fuel meal recommendations based on your goal.
          </p>

          <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#536b3b] px-6 py-3 text-sm sm:text-base font-semibold text-cream-50 shadow-sm transition-colors duration-200 group-hover:bg-[#435a30]">
            Get Early Access
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:gap-5">
            {points.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.text} className="flex items-center gap-2">
                  <Icon className="h-5 w-5 flex-shrink-0 text-[#536b3b]" strokeWidth={1.5} />
                  <span className="text-[#3f4939] text-xs sm:text-sm font-medium whitespace-nowrap">
                    {p.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute right-[1.5%] top-1/2 hidden w-[16%] -translate-y-1/2 text-center text-cream-50 sm:block">
          <p className="font-serif text-lg italic leading-[1.35]">A healthier<br />you is<br />coming soon.</p>
          <Leaf className="mx-auto mt-4 h-8 w-8 rotate-[-25deg] text-avocado-300" strokeWidth={1.4} />
        </div>
      </Link>
    </section>
  );
}
