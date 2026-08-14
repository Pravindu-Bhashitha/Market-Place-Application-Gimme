import { Col, Row } from "react-bootstrap";
import ListingCard from "./ListingCard";
import type { Listing } from "../types/listing.types";

interface ListingGridProps {
  listings: Listing[];
}

const ListingGrid = ({ listings }: ListingGridProps) => {
  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {listings.map((listing) => (
        <Col key={listing.id}>
          <ListingCard listing={listing} />
        </Col>
      ))}
    </Row>
  );
};

export default ListingGrid;