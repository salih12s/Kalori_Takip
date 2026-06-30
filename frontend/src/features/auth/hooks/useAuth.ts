import { useContext } from "react";

import { AuthContext, type AuthContextValue } from "../../../app/providers/AuthProvider";

/** Access the auth session. Must be used inside <AuthProvider>. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
