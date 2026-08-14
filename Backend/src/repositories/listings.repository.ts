import { db } from "../config/db";
import { Listing, ListingsQuery, NewListingInput } from "../types/listing.types";

interface FindAllResult {
    rows: Listing[];
    total: number;
}

export const listingsRepository = {
    findAll(query: ListingsQuery): FindAllResult {
        const { search, category, minPrice, maxPrice, sortBy, sortOrder, page = 1, pageSize = 12 } = query;

        const where: string[] = [];
        const params: Record<string, unknown> = {};

        if (search) {
            where.push("title LIKE @search OR description LIKE @search");
            params.search = `%${search}%`;
        }
        if (category) {
            where.push("category = @category");
            params.category = category;
        }
        if (minPrice !== undefined) {
            where.push("price >= @minPrice");
            params.minPrice = minPrice;
        }
        if (maxPrice !== undefined) {
            where.push("price <= @maxPrice");
            params.maxPrice = maxPrice;
        }

        const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
        const sortColumn = sortBy === "price" ? "price" : "createdAt";
        const sortDirection = sortOrder === "asc" ? "ASC" : "DESC";

        const total = (
            db.prepare(`SELECT COUNT(*) AS count FROM listings ${whereClause}`).get(params) as {
                count: number;
            }
        ).count;

        const offset = (page - 1) * pageSize;
        const rows = db
            .prepare(
                `SELECT * FROM listings ${whereClause}
         ORDER BY ${sortColumn} ${sortDirection}, id ${sortDirection}
         LIMIT @limit OFFSET @offset`
            )
            .all({ ...params, limit: pageSize, offset }) as Listing[];

        return { rows, total };
    },

    findById(id: number): Listing | undefined {
        return db.prepare("SELECT * FROM listings WHERE id = ?").get(id) as Listing | undefined;
    },

    findSimilar(category: string, excludeId: number, limit = 4): Listing[] {
        return db
            .prepare(
                `SELECT * FROM listings
         WHERE category = ? AND id != ?
         ORDER BY createdAt DESC
         LIMIT ?`
            )
            .all(category, excludeId, limit) as Listing[];
    },

    create(input: NewListingInput & { createdAt: string }): Listing {
        const result = db
            .prepare(
                `INSERT INTO listings (title, category, price, condition, description, imageUrl, createdAt)
         VALUES (@title, @category, @price, @condition, @description, @imageUrl, @createdAt)`
            )
            .run({ ...input, imageUrl: input.imageUrl ?? null });

        return this.findById(result.lastInsertRowid as number)!;
    },

    deleteById(id: number): boolean {
        const result = db.prepare("DELETE FROM listings WHERE id = ?").run(id);
        return result.changes > 0;
    },
};