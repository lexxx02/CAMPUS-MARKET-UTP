// ============================================================
// Stock Badge Component
// ============================================================

import { getStockStatus } from '../services/productService';

const StockBadge = ({ stock, kioskId = null, size = 'sm' }) => {
  const status = getStockStatus(stock, kioskId);
  const qty = kioskId
    ? (stock[kioskId] || 0)
    : Object.values(stock).reduce((a, b) => a + b, 0);

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  const statusClasses = {
    available: 'bg-brand-success/15 text-brand-success border-brand-success/25',
    low: 'bg-brand-warning/15 text-brand-warning border-brand-warning/25',
    out: 'bg-brand-danger/15 text-brand-danger border-brand-danger/25',
  };

  const dotColors = {
    available: 'bg-brand-success',
    low: 'bg-brand-warning',
    out: 'bg-brand-danger',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${sizeClasses[size]} ${statusClasses[status.type]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status.type]} ${status.type !== 'out' ? 'animate-pulse' : ''}`} />
      {status.label} {status.type !== 'out' && `(${qty})`}
    </span>
  );
};

export default StockBadge;
