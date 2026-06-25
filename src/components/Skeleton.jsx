// ============================================================
// Skeleton Loading Component — Glassmorphism Theme
// ============================================================

const Skeleton = ({ className = '', variant = 'rect', theme = 'light' }) => {
  const base = theme === 'dark' 
    ? 'bg-[#2A2A2A] rounded-lg animate-pulse' 
    : 'shimmer-light rounded-lg';

  if (variant === 'circle') {
    return <div className={`${base} rounded-full ${className}`} />;
  }

  if (variant === 'text') {
    return <div className={`${base} h-4 ${className}`} />;
  }

  return <div className={`${base} ${className}`} />;
};

// Card skeleton matching the split theme ProductCard layout
export const ProductCardSkeleton = () => (
  <div className="rounded-[28px] overflow-hidden bg-[#111111] border border-[#222222] flex flex-col h-full">
    {/* Top Half: Light Image Area */}
    <div className="h-[220px] bg-[#F5F5F7] flex items-center justify-center p-6 relative">
      <div className="w-full h-full shimmer-light rounded-xl opacity-50" />
      {/* Category chip placeholder */}
      <div className="absolute top-4 left-4 w-16 h-7 rounded-xl shimmer-light opacity-70" />
      {/* Badge placeholder */}
      <div className="absolute top-4 right-4 w-20 h-7 rounded-full shimmer-light opacity-70" />
    </div>

    {/* Bottom Half: Dark Content Area */}
    <div className="p-5 flex-1 flex flex-col gap-3">
      <Skeleton variant="text" theme="dark" className="w-3/4 h-6" />
      <Skeleton variant="text" theme="dark" className="w-1/2 h-3" />
      
      <div className="flex-1 min-h-[4px]" />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#333333] to-transparent my-1" />
      
      <div className="space-y-2 pt-1">
        <div className="flex justify-between items-center py-2 px-3.5 rounded-2xl bg-[#1A1A1A] border border-[#222222]">
          <Skeleton variant="text" theme="dark" className="w-16 h-3" />
          <Skeleton variant="text" theme="dark" className="w-14 h-5 rounded-full" />
        </div>
        <div className="flex justify-between items-center py-2 px-3.5 rounded-2xl bg-[#1A1A1A] border border-[#222222]">
          <Skeleton variant="text" theme="dark" className="w-16 h-3" />
          <Skeleton variant="text" theme="dark" className="w-14 h-5 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

// Dashboard stat skeleton (admin — glass theme)
export const StatCardSkeleton = () => (
  <div className="admin-glass-card rounded-[24px] p-7">
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
