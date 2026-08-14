import type {
  Listing,
  ListingWithSimilar,
  ListingsQueryParams,
  ListingsResponse,
  NewListingInput,
} from "../types/listing.types";
import axiosClient from "./axiosClient";


export const listingsApi = {
    async getAll(params: ListingsQueryParams): Promise<ListingsResponse> {
        const response = await axiosClient.get<ListingsResponse>("/listings", { params });
        return response.data;
    },

    async getById(id: number): Promise<ListingWithSimilar> {
        const response = await axiosClient.get<ListingWithSimilar>(`/listings/${id}`);
        return response.data;
    },

    async create(newListing: NewListingInput): Promise<Listing> {
        const response = await axiosClient.post<Listing>("/listings", newListing);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await axiosClient.delete(`/listings/${id}`);
    }
};