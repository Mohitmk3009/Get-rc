import { useEffect, useState } from 'react';

interface PaginationProps {
  totalPages: number;
  setCurrentPage: (page: number) => void;
  currentPage: number;
}

const Pagination = ({ totalPages, setCurrentPage, currentPage }: PaginationProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [visibleRange, setVisibleRange] = useState({ start: 1, end: 10 });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setVisibleRange(isMobile ? { start: 1, end: 5 } : { start: 1, end: 10 });
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);

      const rangeSize = isMobile ? 2 : 5;

      if (page === visibleRange.end && visibleRange.end < totalPages) {
        setVisibleRange((prev) => ({ start: prev.start + rangeSize, end: Math.min(prev.end + rangeSize, totalPages) }));
      } else if (page === visibleRange.start && visibleRange.start > 1) {
        setVisibleRange((prev) => ({ start: Math.max(prev.start - rangeSize, 1), end: prev.end - rangeSize }));
      } else if (page === 1) {
        setVisibleRange(isMobile ? { start: 1, end: 5 } : { start: 1, end: 10 });
      }
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`m-1 px-3 py-1 rounded-full ${
            currentPage === i
              ? 'bg-black text-white'
              : 'bg-white text-black border border-black hover:bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center mt-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mx-1 px-3 py-1 rounded-full border border-black bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="mx-1 px-3 py-1 rounded-full border border-black bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
