import { useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { useListings } from "../hooks/useListings";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import ListingGrid from "../components/ListingGrid";
import PaginationControls from "../components/PaginationControls";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import type { ListingsQueryParams } from "../types/listing.types";
import { DEFAULT_FILTERS } from "../constants/listing.constants";
import type { FilterValues } from "../components/FilterBar";
import FilterBar from "../components/FilterBar";

const ListingsPage = () => {
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(filters.search, 350);
  const debouncedMinPrice = useDebouncedValue(filters.minPrice, 350);
  const debouncedMaxPrice = useDebouncedValue(filters.maxPrice, 350);

  const queryParams = useMemo<ListingsQueryParams>(
    () => ({
      search: debouncedSearch || undefined,
      category: filters.category || undefined,
      minPrice: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
      maxPrice: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      page,
      pageSize: 12,
    }),
    [debouncedSearch, debouncedMinPrice, debouncedMaxPrice, filters.category, filters.sortBy, filters.sortOrder, page]
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