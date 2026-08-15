import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { validateRegisterForm } from "../validators/auth.validator";
import type { RegisterFormState, AuthFormErrors } from "../validators/auth.validator";
import ErrorState from "../components/ErrorState";
import PasswordInput from "../components/PasswordInput";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [values, setValues] = useState<RegisterFormState>({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<AuthFormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const update = (patch: Partial<RegisterFormState>) => setValues((prev) => ({ ...prev, ...patch }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateRegisterForm(values);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setSubmitting(true);
        setSubmitError(null);
        try {
            await register({ email: values.email, password: values.password });
            navigate("/");
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Registration failed.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center h-100 w-100">
            <Container style={{ maxWidth: 420 }}>
                <h2 className="mb-4">Create an Account</h2>

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

                    <Form.Group className="mb-3">
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

                    <Form.Group className="mb-4">
                        <Form.Label>Confirm Password</Form.Label>
                        <PasswordInput
                            value={values.confirmPassword}
                            onChange={(v) => update({ confirmPassword: v })}
                            isInvalid={!!errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid" className={errors.confirmPassword ? "d-block" : ""}>
                            {errors.confirmPassword}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit" variant="primary" disabled={submitting} className="w-100">
                        {submitting ? "Creating account..." : "Register"}
                    </Button>
                </Form>

                <p className="text-center mt-3 text-muted">
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </Container>
        </div>
    );
};

export default RegisterPage;