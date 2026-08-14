import { Spinner } from "react-bootstrap";

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
}

const LoadingState = ({ message = "Loading...", fullPage = false }: LoadingStateProps) => {
  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center gap-2 ${
        fullPage ? "vh-100" : "py-5"
      }`}
    >
      <Spinner animation="border" role="status" />
      <span className="text-muted">{message}</span>
    </div>
  );
};

export default LoadingState;