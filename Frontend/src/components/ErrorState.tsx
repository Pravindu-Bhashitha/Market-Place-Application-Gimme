import { Alert, Button } from "react-bootstrap";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <Alert variant="danger" className="d-flex flex-column align-items-start gap-2 my-4">
      <div>
        <strong>Something went wrong.</strong> {message}
      </div>
      {onRetry && (
        <Button variant="outline-danger" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Alert>
  );
};

export default ErrorState;