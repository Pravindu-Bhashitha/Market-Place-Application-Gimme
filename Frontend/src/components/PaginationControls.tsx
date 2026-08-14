import { Pagination } from "react-bootstrap";
import type { Pagination as PaginationMeta } from "../types/listing.types";

interface PaginationControlsProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

const PaginationControls = ({ pagination, onPageChange }: PaginationControlsProps) => {
  const { page, totalPages } = pagination;
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination className="justify-content-center mt-4">
      <Pagination.Prev disabled={page === 1} onClick={() => onPageChange(page - 1)} />
      {pages.map((p) => (
        <Pagination.Item key={p} active={p === page} onClick={() => onPageChange(p)}>
          {p}
        </Pagination.Item>
      ))}
      <Pagination.Next disabled={page === totalPages} onClick={() => onPageChange(page + 1)} />
    </Pagination>
  );
};

export default PaginationControls;