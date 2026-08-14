import { Row, Col } from "react-bootstrap";
import ListingCard from "./ListingCard";
import type { Listing } from "../types/listing.types";

interface SimilarListingsProps {
  listings: Listing[];
}

const SimilarListings = ({ listings }: SimilarListingsProps) => {
  if (listings.length === 0) return null;

  return (
    <div className="mt-5">
      <h4 className="mb-3">Similar items</h4>
      <Row xs={1} sm={2} md={4} className="g-4">
        {listings.map((listing) => (
          <Col key={listing.id}>
            <ListingCard listing={listing} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SimilarListings;