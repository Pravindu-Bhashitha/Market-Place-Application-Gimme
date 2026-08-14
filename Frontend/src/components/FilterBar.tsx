import { Col, Form, Row } from "react-bootstrap";
import { CATEGORIES } from "../types/listing.types";

export interface FilterValues {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: "price" | "date";
  sortOrder: "asc" | "desc";
}

interface FilterBarProps {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
}

const FilterBar = ({ values, onChange }: FilterBarProps) => {
  const update = (patch: Partial<FilterValues>) => onChange({ ...values, ...patch });

  return (
    <Row className="g-2 mb-4 align-items-end">
      <Col md={3}>
        <Form.Label className="small text-muted mb-1">Search</Form.Label>
        <Form.Control
          placeholder="Search by name..."
          value={values.search}
          onChange={(e) => update({ search: e.target.value })}
        />
      </Col>
      <Col md={2}>
        <Form.Label className="small text-muted mb-1">Category</Form.Label>
        <Form.Select value={values.category} onChange={(e) => update({ category: e.target.value })}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Form.Select>
      </Col>
      <Col md={2}>
        <Form.Label className="small text-muted mb-1">Min price</Form.Label>
        <Form.Control
          type="number"
          min={0}
          value={values.minPrice}
          onChange={(e) => update({ minPrice: e.target.value })}
        />
      </Col>
      <Col md={2}>
        <Form.Label className="small text-muted mb-1">Max price</Form.Label>
        <Form.Control
          type="number"
          min={0}
          value={values.maxPrice}
          onChange={(e) => update({ maxPrice: e.target.value })}
        />
      </Col>
      <Col md={2}>
        <Form.Label className="small text-muted mb-1">Sort by</Form.Label>
        <Form.Select
          value={values.sortBy}
          onChange={(e) => update({ sortBy: e.target.value as FilterValues["sortBy"] })}
        >
          <option value="date">Date listed</option>
          <option value="price">Price</option>
        </Form.Select>
      </Col>
      <Col md={1}>
        <Form.Label className="small text-muted mb-1">Order</Form.Label>
        <Form.Select
          value={values.sortOrder}
          onChange={(e) => update({ sortOrder: e.target.value as FilterValues["sortOrder"] })}
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </Form.Select>
      </Col>
    </Row>
  );
};

export default FilterBar;