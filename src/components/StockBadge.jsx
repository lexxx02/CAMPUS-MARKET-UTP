// ============================================================
// Stock Badge Component
// ============================================================

import { getStockStatus } from '../services/productService';

const StockBadge = ({ stock, kioskId = null, size = 'sm', theme = 'light' }) => {
  const status = getStockStatus(stock, kioskId);
  const qty = kioskId
    ? (stock[kioskId] || 0)
    : Object.values(stock).reduce((a, b) => a + b, 0);

  const sizeClasses = {
    xs: 'text-[10px] px-2.5 py-1',
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
  };

  const statusClasses = {
    light: {
      available: 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]',
      low:       'bg-[#fef3c7] text-[#b45309] border-[#fde68a]',
      out:       'bg-[#fee2e2] text-[#dc2626] border-[#fecaca]',
    },
    dark: {
      available: 'bg-[#22c55e]/10 text-[#4ade80] border-[#22c55e]/20',
      low:       'bg-[#f59e0b]/10 text-[#fbbf24] border-[#f59e0b]/20',
      out:       'bg-[#dc2626]/10 text-[#f87171] border-[#dc2626]/20',
    }
  };

  const dotColors = {
    available: 'bg-[#22c55e]',
    low:       'bg-[#f59e0b]',
    out:       'bg-[#dc2626]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold whitespace-nowrap ${sizeClasses[size]} ${statusClasses[theme][status.type]}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${dotColors[status.type]} ${
          status.type === 'available' ? 'animate-pulse' : status.type === 'low' ? 'animate-pulse' : ''
        }`}
      />
      {status.label} {status.type !== 'out' && `(${qty})`}
    </span>
  );
};

export default StockBadge;
