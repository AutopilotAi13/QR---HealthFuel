import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 48 48',
};

/* Meals — plate with fork and knife */
export function MealsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="26" r="14" />
      <path d="M10 12v8a4 4 0 0 0 8 0V12M14 12v20" />
      <path d="M38 12c-3 0-4 3-4 7s1 5 4 5v8" />
    </svg>
  );
}

/* Salads — bowl with leaf greens */
export function SaladsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 24h36a18 18 0 0 1-36 0Z" />
      <path d="M14 24c0-6 4-10 10-10s10 4 10 10" />
      <path d="M24 14c0-4 3-7 8-7-1 5-4 7-8 7ZM24 14c0-4-3-7-8-7 1 5 4 7 8 7Z" />
    </svg>
  );
}

/* Protein Bowls — deep bowl with contents */
export function ProteinBowlsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 22h36a18 18 0 0 1-36 0Z" />
      <path d="M12 22c0-5 5-9 12-9s12 4 12 9" />
      <circle cx="19" cy="16" r="2.5" />
      <circle cx="29" cy="16" r="2.5" />
      <path d="M24 13v-3" />
    </svg>
  );
}

/* Sprout Bowls — bowl with sprouts */
export function SproutBowlsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 24h36a18 18 0 0 1-36 0Z" />
      <path d="M18 24c0-4 2-7 6-7M30 24c0-4-2-7-6-7M24 17v-4" />
      <path d="M20 13c0-3 2-5 4-5M28 13c0-3-2-5-4-5" />
    </svg>
  );
}

/* Protein Sandwiches — sandwich shape */
export function ProteinSandwichesIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 16c0-3 7-5 16-5s16 2 16 5" />
      <path d="M8 24c0 1 7 3 16 3s16-2 16-3" />
      <path d="M8 32c0 3 7 5 16 5s16-2 16-5" />
      <path d="M8 16v16M40 16v16" />
      <path d="M14 20h20M14 28h20" />
    </svg>
  );
}

/* Smoothie — glass with straw and fruit */
export function SmoothieIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 10h20l-2 28a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4L14 10Z" />
      <path d="M14 10h20" />
      <path d="M22 10V6h8" />
      <path d="M19 18c2 2 8 2 10 0" />
      <circle cx="21" cy="26" r="2" />
      <circle cx="28" cy="28" r="2" />
    </svg>
  );
}

/* Corn — corn cob with husk */
export function CornIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18 8c-2 4-2 28 0 32 6 0 12-4 12-16S24 8 18 8Z" />
      <path d="M18 8c-4 0-8 4-8 10 0 4 4 6 8 6" />
      <path d="M22 14v20M26 14v20M18 14v20" />
    </svg>
  );
}

/* Drinks — bottle */
export function DrinksIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 6h8v6l3 4a8 8 0 0 1 3 6v16a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V22a8 8 0 0 1 3-6l3-4V6Z" />
      <path d="M14 28h20" />
      <path d="M20 6h8" />
    </svg>
  );
}

/* No-Bake Dessert Bar — sliced dessert */
export function DessertBarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 14h32v20a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V14Z" />
      <path d="M8 14l4-6h24l4 6" />
      <path d="M18 14v24M30 14v24" />
      <path d="M14 22h6M28 22h6" />
    </svg>
  );
}

/* Detox Shot — small shot glass with leaf */
export function DetoxShotIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M16 10h16l-2 28a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4L16 10Z" />
      <path d="M16 10h16" />
      <path d="M24 4v6" />
      <path d="M22 20c0-3 2-5 4-5s4 2 4 5-2 5-4 5-4-2-4-5Z" />
    </svg>
  );
}

/* Fallback */
export function DefaultCategoryIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="24" r="16" />
      <circle cx="24" cy="24" r="6" />
    </svg>
  );
}
