import type { FilterValues } from "../components/FilterBar";
import type { Listing } from "../types/listing.types";


export const CONDITION_VARIANTS: Record<Listing["condition"], string> = {
  new: "success",
  "like-new": "primary",
  good: "secondary",
  fair: "warning",
};

export const DEFAULT_FILTERS: FilterValues = {
  search: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  sortBy: "date",
  sortOrder: "desc",
};