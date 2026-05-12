// ============================================================
// Skeleton Loading Component
// ============================================================

const Skeleton = ({ className = '', variant = 'rect' }) => {
  const base = 'shimmer rounded-lg animate-pulse';

  if (variant === 'circle') {
    return <div className={`${base} rounded-full ${className}`} />;
  }

  if (variant === 'text') {
    return <div className={`${base} h-4 ${className}`} />;
  }

  return <div className={`${base} ${className}`} />;
};

// Card skeleton for product loading
export const ProductCardSkeleton = () => (
  <div className="bg-brand-card rounded-2xl overflow-hidden border border-brand-border">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2 h-3" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton variant="text" className="w-16 h-6" />
        <Skeleton variant="text" className="w-20 h-5" />
      </div>
    </div>
  </div>
);

// Dashboard stat skeleton
export const StatCardSkeleton = () => (
  <div className="bg-brand-card rounded-2xl p-6 border border-brand-border">
    <div className="flex justify-between items-start">
      <div className="space-y-3 flex-1">
        <Skeleton variant="text" className="w-24 h-3" />
        <Skeleton variant="text" className="w-16 h-8" />
      </div>
      <Skeleton variant="circle" className="w-12 h-12" />
    </div>
  </div>
);

export default Skeleton;
