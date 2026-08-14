import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { validateLoginForm } from "../validators/auth.validator";
import type { LoginFormState, AuthFormErrors } from "../validators/auth.validator";
import ErrorState from "../components/ErrorState";
import PasswordInput from "../components/PasswordInput";


const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [values, setValues] = useState<LoginFormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (patch: Partial<LoginFormState>) => setValues((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await login(values);
      navigate("/");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container style={{ maxWidth: 420 }}>
      <h2 className="mb-4">Log In</h2>

      {submitError && <ErrorState message={submitError} />}

      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={values.email}
            onChange={(e) => update({ email: e.target.value })}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Password</Form.Label>
          <PasswordInput
            value={values.password}
            onChange={(v) => update({ password: v })}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid" className={errors.password ? "d-block" : ""}>
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary" disabled={submitting} className="w-100">
          {submitting ? "Logging in..." : "Log In"}
        </Button>
      </Form>

      <p className="text-center mt-3 text-muted">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </Container>
  );
};

export default LoginPage;