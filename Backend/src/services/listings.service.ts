import { Listing, ListingsQuery, ListingWithSimilar, NewListingInput, Pagination } from "../types/listing.types";
import { listingsRepository } from "../repositories/listings.repository";
import { ApiError } from "../utils/ApiError";
import { normalizePagination } from "../utils/pagination";

const SIMILAR_ITEMS_LIMIT = 4;

export const listingsService = {
    getListings(query: ListingsQuery): { data: Listing[], pagination: Pagination } {
        const { page, pageSize } = normalizePagination(query.page, query.pageSize);

        const { rows, total } = listingsRepository.findAll({ ...query, page, pageSize });

        return {
            data: rows,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.max(1, Math.ceil(total / pageSize)),
            },
        };
    },

    getListingById(id: number): ListingWithSimilar | null {
        const listing = listingsRepository.findById(id);
        if (!listing) {
            throw new ApiError(404, `Listing with id ${id} not found`);
        };

        const similarListings = listingsRepository.findSimilar(listing.category, listing.id, SIMILAR_ITEMS_LIMIT);

        return {
            ...listing,
            similarListings,
        };
    },

    createListing(input: NewListingInput): Listing {
        const createdAt = new Date().toISOString();
        return listingsRepository.create({ ...input, createdAt });
    },

    deleteListing(id: number): void {
        const deleted = listingsRepository.deleteById(id);
        if (!deleted) {
            throw new ApiError(404, `No listing found with id ${id}.`);
        }
    },
};