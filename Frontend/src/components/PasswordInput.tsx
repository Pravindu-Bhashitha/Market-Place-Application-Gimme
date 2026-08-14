import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
  placeholder?: string;
}

const PasswordInput = ({ value, onChange, isInvalid, placeholder }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <InputGroup hasValidation>
      <Form.Control
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        isInvalid={isInvalid}
        placeholder={placeholder}
      />
      <Button
        variant="outline-secondary"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeSlash /> : <Eye />}
      </Button>
    </InputGroup>
  );
};

export default PasswordInput;