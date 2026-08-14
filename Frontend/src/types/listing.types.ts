export type Condition = "new" | "like-new" | "good" | "fair";

export interface Listing {
  id: number;
  title: string;
  category: string;
  price: number;
  condition: Condition;
  description: string;
  imageUrl: string | null;
  createdAt: string;
}

export interface ListingWithSimilar extends Listing {
  similarListings: Listing[];
}

export interface NewListingInput {
  title: string;
  category: string;
  price: number;
  condition: Condition;
  description: string;
  imageUrl?: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ListingsResponse {
  data: Listing[];
  pagination: Pagination;
}

export interface ListingsQueryParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "date";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface ApiErrorResponse {
  error: {
    message: string;
    description?: string;
  };
}

export const CATEGORIES = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Books",
  "Sports & Outdoors",
  "Home & Garden",
  "Toys & Games",
  "Vehicles",
] as const;

export const CONDITIONS: { value: Condition; label: string }[] = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like new" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];