import { Badge, Card } from "react-bootstrap";
import type { Listing } from "../types/listing.types";
import { Link } from "react-router-dom";
import { CONDITION_VARIANTS } from "../constants/listing.constants";
import { getOptimizedImageUrl } from "../utils/getOptimizedImageUrl";

interface ListingCardProps {
    listing: Listing;
}



const ListingCard = ({ listing }: ListingCardProps) => {
    return (
        <Card as={Link} to={`/listings/${listing.id}`} className="text-decoration-none text-dark shadow-sm">
            <Card.Img
                variant="top"
                 src={getOptimizedImageUrl(listing.imageUrl, 400)}
                alt={listing.title}
                style={{ height: 180, objectFit: "cover" }}
                loading="lazy"
            />
            <Card.Body className="d-flex flex-column">
                <Card.Title className="fs-6 mb-1">{listing.title}</Card.Title>
                <Card.Text className="text-muted small mb-2">{listing.category}</Card.Text>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="fw-bold">${listing.price.toFixed(2)}</span>
                    <Badge bg={CONDITION_VARIANTS[listing.condition]}>{listing.condition}</Badge>
                </div>
            </Card.Body>
        </Card>
    );
}

export default ListingCard;