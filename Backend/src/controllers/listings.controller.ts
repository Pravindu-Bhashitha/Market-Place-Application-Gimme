import { ApiError } from "../utils/ApiError";
import { Request, Response, NextFunction } from "express";
import { listingsService } from "../services/listings.service";
import { ListingsQuery } from "../types/listing.types";
import { validateNewListing } from "../validators/listing.validator";
import { parseId } from "../utils/parseId";

export const listingsController = {
    getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { search, category, minPrice, maxPrice, sortBy, sortOrder, page, pageSize } = req.query;

            const query: ListingsQuery = {
                search: typeof search === "string" ? search : undefined,
                category: typeof category === "string" ? category : undefined,
                minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
                maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
                sortBy: sortBy === "price" ? "price" : "date",
                sortOrder: sortOrder === "asc" ? "asc" : "desc",
                page: page !== undefined ? Number(page) : undefined,
                pageSize: pageSize !== undefined ? Number(pageSize) : undefined,
            };

            const result = listingsService.getListings(query);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
    getById(req: Request, res: Response, next: NextFunction): void {
        try {
            const id = parseId(req.params.id);
            const result = listingsService.getListingById(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
    create(req: Request, res: Response, next: NextFunction): void {
        const { value, errors } = validateNewListing(req.body);
        if (!value) {
            return next (new ApiError(400, "Invalid request body", errors.join(" ")));
        }
        try {
            const result = listingsService.createListing(value);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },
    delete(req: Request, res: Response, next: NextFunction): void {
        try {
            const id = parseId(req.params.id);
            listingsService.deleteListing(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}