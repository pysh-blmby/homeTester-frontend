import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from './button';

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNextPage, 
  hasPrevPage,
  totalItems,
  limit
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  const startRange = (currentPage - 1) * limit + 1;
  const endRange = Math.min(currentPage * limit, totalItems);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-slate-100">
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        Showing <span className="text-slate-900">{startRange}–{endRange}</span> of <span className="text-slate-900">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="h-10 w-10 rounded-xl border-slate-200 text-slate-600 disabled:opacity-30 disabled:bg-slate-50 transition-all active:scale-90"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`h-10 min-w-[40px] px-2 rounded-xl text-xs font-bold transition-all active:scale-90 ${
                currentPage === page 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-100'
              }`}
            >
              {page}
            </button>
          ))}
          {totalPages > 5 && getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
            <div className="flex items-center px-2 text-slate-300">
              <MoreHorizontal className="w-4 h-4" />
            </div>
          )}
        </div>

        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="h-10 w-10 rounded-xl border-slate-200 text-slate-600 disabled:opacity-30 disabled:bg-slate-50 transition-all active:scale-90"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
