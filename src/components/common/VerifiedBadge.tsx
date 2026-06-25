interface VerifiedBadgeProps {
  className?: string;
}

export function VerifiedBadge({ className }: VerifiedBadgeProps): React.JSX.Element {
  return (
    <span className={className} title="FoodRush Verified Dish">
      <svg className="size-3.5 fill-primary text-white" viewBox="0 0 24 24">
        <title>Verified dish</title>
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    </span>
  );
}
