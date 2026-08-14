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
  imageUrl?: string | null;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ListingsQuery {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "date";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}