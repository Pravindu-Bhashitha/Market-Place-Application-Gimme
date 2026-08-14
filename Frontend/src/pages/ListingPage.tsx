import { useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import type { ListingsQueryParams } from "../types/listing.types";
import type { FilterValues } from "../components/FilterBar";
import FilterBar from "../components/FilterBar";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ListingGrid from "../components/ListingGrid";
import { DEFAULT_FILTERS } from "../constants/listing.constants";
import PaginationControls from "../components/PaginationControls";
import { useListings } from "../hooks/useListings";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

const ListingsPage = () => {
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(filters.search, 350);

  const queryParams = useMemo<ListingsQueryParams>(
    () => ({
      search: debouncedSearch || undefined,
      category: filters.category || undefined,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      page,
      pageSize: 12,
    }),
    [debouncedSearch, filters.category, filters.minPrice, filters.maxPrice, filters.sortBy, filters.sortOrder, page]
  );

  const { listings, pagination, loading, error, refetch } = useListings(queryParams);

  const handleFilterChange = (values: FilterValues) => {
    setFilters(values);
    setPage(1);
  };

  return (
    <Container>
      <h2 className="mb-4">Browse Listings</h2>
      <FilterBar values={filters} onChange={handleFilterChange} />

      {loading && <LoadingState message="Loading listings..." />}
      {!loading && error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && listings.length === 0 && (
        <EmptyState title="No listings found" description="Try adjusting your search or filters." />
      )}
      {!loading && !error && listings.length > 0 && (
        <>
          <ListingGrid listings={listings} />
          {pagination && <PaginationControls pagination={pagination} onPageChange={setPage} />}
        </>
      )}
    </Container>
  );
};

export default ListingsPage;