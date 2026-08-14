import { Condition, NewListingInput } from "../types/listing.types";

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

export const CONDITIONS: Condition[] = ["new", "like-new", "good", "fair"];

interface ValidationResult {
    value?: NewListingInput;
    errors: string[];
}

export function validateNewListing(body: unknown): ValidationResult {
    const errors: string[] = [];

    if (typeof body !== "object" || body === null) {
        return { errors: ["Request body must be a valid JSON object"] };
    }

    const b = body as Record<string, unknown>;

    const title = typeof b.title === "string" ? b.title.trim() : "";

    if (!title) {
        errors.push("Title is required and must be a non-empty string.");
    } else if (title.length < 3 || title.length > 100) {
        errors.push("Title must be between 3 and 100 characters long.");
    }

    const category = typeof b.category === "string" ? b.category.trim() : "";

    if (!category) {
        errors.push("Category is required and must be a non-empty string.");
    } else if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
        errors.push(`Category must be one of the following: ${CATEGORIES.join(", ")}.`);
    }

    const price = typeof b.price === "number" ? b.price : Number(b.price);

    if (b.price === undefined || b.price === null || b.price === "") {
        errors.push("price is required.");
    } else if (!Number.isFinite(price) || price <= 0) {
        errors.push("price must be a number greater than 0.");
    }

    const condition = typeof b.condition === "string" ? (b.condition as Condition) : undefined;

    if (!condition) {
        errors.push("Condition is required and must be a non-empty string.");
    } else if (!CONDITIONS.includes(condition as (typeof CONDITIONS)[number])) {
        errors.push(`Condition must be one of the following: ${CONDITIONS.join(", ")}.`);
    }

    const description = typeof b.description === "string" ? b.description.trim() : "";

    if (!description) errors.push("description is required.");
    else if (description.length < 10 || description.length > 2000) {
        errors.push("description must be between 10 and 2000 characters.");
    }

    let imageUrl: string | null | undefined;

    if (b.imageUrl !== undefined && b.imageUrl !== null && b.imageUrl !== "") {
        if (typeof b.imageUrl !== "string") {
            errors.push("Image URL must be a string.");
        } else {
            try {
                new URL(b.imageUrl);
                imageUrl = b.imageUrl;
            } catch {
                errors.push("Image URL must be a valid URL.");
            }
        }
    }

    if (errors.length > 0) {
        return { errors };
    }

    return { value: { title, category, price, condition: condition!, description, imageUrl }, errors: [] };
}