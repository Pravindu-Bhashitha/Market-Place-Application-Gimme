export interface LoginFormState {
    email: string;
    password: string;
}

export interface RegisterFormState {
    email: string;
    password: string;
    confirmPassword: string;
}

export type AuthFormErrors = Partial<Record<string, string>>;

export const validateLoginForm = (values: LoginFormState): AuthFormErrors => {
    const errors: AuthFormErrors = {};
    if (!values.email.trim()) errors.email = "Email is required.";
    if (!values.password) errors.password = "Password is required.";
    return errors;
};

export const validateRegisterForm = (values: RegisterFormState): AuthFormErrors => {
    const errors: AuthFormErrors = {};

    if (!values.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
        errors.email = "Enter a valid email address.";

    if (!values.password) errors.password = "Password is required.";
    else if (values.password.length < 8) errors.password = "Password must be at least 8 characters.";

    if (!values.confirmPassword) errors.confirmPassword = "Please confirm your password.";
    else if (values.password !== values.confirmPassword) errors.confirmPassword = "Passwords do not match.";

    return errors;
};