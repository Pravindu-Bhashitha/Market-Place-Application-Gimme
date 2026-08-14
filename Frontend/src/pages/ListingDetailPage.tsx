import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { listingsApi } from "../api/listings.api";
import type { ListingWithSimilar } from "../types/listing.types";
import { CONDITION_VARIANTS } from "../constants/listing.constants";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import SimilarListings from "../components/SimilarListings";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";

const ListingDetailPage = () => {
    const {user} = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [listing, setListing] = useState<ListingWithSimilar | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const fetchListing = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await listingsApi.getById(Number(id));
            setListing(data);
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.error?.message ?? "Failed to load this listing."
                : "Failed to load this listing.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListing();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;
        setDeleting(true);
        setDeleteError(null);
        try {
            await listingsApi.delete(Number(id));
            navigate("/");
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.error?.message ?? "Failed to delete this listing."
                : "Failed to delete this listing.";
            setDeleteError(message);
            setShowConfirm(false);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <LoadingState message="Loading listing..." />;
    if (error) return <ErrorState message={error} onRetry={fetchListing} />;
    if (!listing) return null;

    return (
        <Container>
            {deleteError && <ErrorState message={deleteError} />}

            <Row className="g-4">
                <Col md={6}>
                    <img
                        src={listing.imageUrl ?? "https://via.placeholder.com/600x450?text=No+Image"}
                        alt={listing.title}
                        className="img-fluid rounded shadow-sm"
                        style={{ width: "100%", maxHeight: 450, objectFit: "cover" }}
                        loading="lazy"
                    />
                </Col>

                <Col md={6}>
                    <h2>{listing.title}</h2>
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <Badge bg="light" text="dark" className="border">
                            {listing.category}
                        </Badge>
                        <Badge bg={CONDITION_VARIANTS[listing.condition]}>{listing.condition}</Badge>
                    </div>

                    <h3 className="mb-3">${listing.price.toFixed(2)}</h3>

                    <p className="text-muted">{listing.description}</p>

                    {user && (
                        <div className="d-flex gap-2 mt-4">
                            <Button variant="danger" onClick={() => setShowConfirm(true)}>
                                Delete listing
                            </Button>
                        </div>
                    )}
                </Col>
            </Row>

            <SimilarListings listings={listing.similarListings} />

            <ConfirmDialog
                show={showConfirm}
                title="Delete this listing?"
                message={`Are you sure you want to delete "${listing.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setShowConfirm(false)}
            />
        </Container>
    );
};

export default ListingDetailPage;