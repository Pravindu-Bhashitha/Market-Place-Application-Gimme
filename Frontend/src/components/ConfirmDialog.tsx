import { Button, Modal } from "react-bootstrap";

interface ConfirmDialogProps {
  show: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  show,
  title,
  message,
  confirmLabel = "Confirm",
  confirmVariant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
          {loading ? "Deleting..." : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDialog;