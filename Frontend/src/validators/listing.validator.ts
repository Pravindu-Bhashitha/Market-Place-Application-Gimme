import type { Condition } from "../types/listing.types";

export interface CreateListingFormState {
  title: string;
  category: string;
  price: string;
  condition: Condition | "";
  description: string;
  imageUrl: string;
}

export type CreateListingFormErrors = Partial<Record<keyof CreateListingFormState, string>>;

export const validateNewListingForm = (values: CreateListingFormState): CreateListingFormErrors => {
  const errors: CreateListingFormErrors = {};

  const title = values.title.trim();
  if (!title) errors.title = "Title is required.";
  else if (title.length < 3 || title.length > 120) errors.title = "Title must be 3-120 characters.";

  if (!values.category) errors.category = "Category is required.";

  const price = Number(values.price);
  if (!values.price) errors.price = "Price is required.";
  else if (!Number.isFinite(price) || price <= 0) errors.price = "Price must be greater than 0.";

  if (!values.condition) errors.condition = "Condition is required.";

  const description = values.description.trim();
  if (!description) errors.description = "Description is required.";
  else if (description.length < 10 || description.length > 2000)
    errors.description = "Description must be 10-2000 characters.";

  if (values.imageUrl) {
    try {
      new URL(values.imageUrl);
    } catch {
      errors.imageUrl = "Image URL must be a valid URL.";
    }
  }

  return errors;
};