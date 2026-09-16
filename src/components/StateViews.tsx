import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 sm:py-32 animate-fade-in">
      <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-avocado-400 animate-spin" />
      <p className="text-cream-100/40 text-sm mt-4 font-medium">{message}</p>
    </div>
  );
}

export function EmptyState({
  title = 'Nothing here yet',
  message = 'Check back soon for new items.',
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 sm:py-32 animate-fade-in">
      <div className="w-12 h-12 rounded-full border border-charcoal-600/40 flex items-center justify-center mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-avocado-500/40" />
      </div>
      <h3 className="text-cream-50 font-medium text-lg">{title}</h3>
      <p className="text-cream-100/40 text-sm mt-1.5 max-w-xs text-center">{message}</p>
    </div>
  );
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 sm:py-32 animate-fade-in">
      <div className="w-12 h-12 rounded-full border border-red-500/20 flex items-center justify-center mb-4">
        <span className="text-red-400/60 text-xl">!</span>
      </div>
      <h3 className="text-cream-50 font-medium text-lg">Unable to load</h3>
      <p className="text-cream-100/40 text-sm mt-1.5 max-w-xs text-center">{message}</p>
    </div>
  );
}

export function NotFoundState({
  title = 'Not found',
  message = 'The page you are looking for does not exist.',
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 sm:py-32 animate-fade-in">
      <h3 className="text-cream-50 font-medium text-lg">{title}</h3>
      <p className="text-cream-100/40 text-sm mt-1.5 max-w-xs text-center">{message}</p>
    </div>
  );
}
