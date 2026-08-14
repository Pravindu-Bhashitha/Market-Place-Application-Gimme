import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { listingsApi } from "../api/listings.api";
import type { Listing, ListingsQueryParams, Pagination } from "../types/listing.types";

interface UseListingsResult {
  listings: Listing[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useListings(params: ListingsQueryParams): UseListingsResult {
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listingsApi.getAll(params);
      setListings(res.data);
      setPagination(res.pagination);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error?.message ?? "Failed to load listings."
        : "Failed to load listings.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params), reloadToken]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const refetch = useCallback(() => setReloadToken((t) => t + 1), []);

  return { listings, pagination, loading, error, refetch };
}