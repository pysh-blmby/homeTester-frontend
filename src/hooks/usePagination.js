import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function usePagination(initialLimit = 10) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [limit, setLimit] = useState(parseInt(searchParams.get('limit')) || initialLimit);

  const onPageChange = useCallback((page) => {
    setCurrentPage(page);
    setSearchParams(prev => {
      prev.set('page', page);
      return prev;
    }, { replace: true });
  }, [setSearchParams]);

  const onLimitChange = useCallback((newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when limit changes
    setSearchParams(prev => {
      prev.set('limit', newLimit);
      prev.set('page', 1);
      return prev;
    }, { replace: true });
  }, [setSearchParams]);

  // Sync with URL params if they change externally
  useEffect(() => {
    const pageParam = parseInt(searchParams.get('page')) || 1;
    const limitParam = parseInt(searchParams.get('limit')) || initialLimit;
    
    if (pageParam !== currentPage) setCurrentPage(pageParam);
    if (limitParam !== limit) setLimit(limitParam);
  }, [searchParams, initialLimit]);

  return {
    currentPage,
    limit,
    onPageChange,
    onLimitChange,
    setCurrentPage // in case we need manual reset
  };
}
