export const ProtectedRoute = ({ children }) => {
    // Temporarily bypass auth checks
    return <>{children}</>;
};
