import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import axios from "axios";
import { listingsApi } from "../api/listings.api";
import { CATEGORIES, CONDITIONS } from "../types/listing.types";
import type { Condition, NewListingInput } from "../types/listing.types";
import { validateNewListingForm } from "../validators/listing.validator";
import type { CreateListingFormState } from "../validators/listing.validator";
import ErrorState from "../components/ErrorState";

const INITIAL_STATE: CreateListingFormState = {
  title: "",
  category: "",
  price: "",
  condition: "",
  description: "",
  imageUrl: "",
};

const CreateListingPage = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<CreateListingFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<ReturnType<typeof validateNewListingForm>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (patch: Partial<CreateListingFormState>) => setValues((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateNewListingForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload: NewListingInput = {
      title: values.title.trim(),
      category: values.category,
      price: Number(values.price),
      condition: values.condition as Condition,
      description: values.description.trim(),
      imageUrl: values.imageUrl.trim() || undefined,
    };

    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await listingsApi.create(payload);
      navigate(`/listings/${created.id}`);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error?.message ?? "Failed to create listing."
        : "Failed to create listing.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container style={{ maxWidth: 720 }}>
      <h2 className="mb-4">Create a New Listing</h2>

      {submitError && <ErrorState message={submitError} />}

      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={values.title}
            onChange={(e) => update({ title: e.target.value })}
            isInvalid={!!errors.title}
          />
          <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={values.category}
                onChange={(e) => update({ category: e.target.value })}
                isInvalid={!!errors.category}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Price ($)</Form.Label>
              <Form.Control
                type="number"
                min={0}
                step="0.01"
                value={values.price}
                onChange={(e) => update({ price: e.target.value })}
                isInvalid={!!errors.price}
              />
              <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Condition</Form.Label>
          <Form.Select
            value={values.condition}
            onChange={(e) => update({ condition: e.target.value as Condition })}
            isInvalid={!!errors.condition}
          >
            <option value="">Select a condition</option>
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errors.condition}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={values.description}
            onChange={(e) => update({ description: e.target.value })}
            isInvalid={!!errors.description}
          />
          <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
          <Form.Text className="text-muted">{values.description.trim().length}/2000 characters</Form.Text>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Image URL (optional)</Form.Label>
          <Form.Control
            value={values.imageUrl}
            onChange={(e) => update({ imageUrl: e.target.value })}
            isInvalid={!!errors.imageUrl}
            placeholder="https://..."
          />
          <Form.Control.Feedback type="invalid">{errors.imageUrl}</Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Creating..." : "Create Listing"}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateListingPage;