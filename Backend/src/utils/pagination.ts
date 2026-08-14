export interface NormalizedPagination {
  page: number;
  pageSize: number;
}

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;

export function normalizePagination(page?: number, pageSize?: number): NormalizedPagination {
  const normalizedPage = page && page > 0 ? page : 1;
  let normalizedPageSize = pageSize && pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE;
  if (normalizedPageSize > MAX_PAGE_SIZE) normalizedPageSize = MAX_PAGE_SIZE;
  return { page: normalizedPage, pageSize: normalizedPageSize };
}