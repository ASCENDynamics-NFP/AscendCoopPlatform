// Minimal test stub for @southdevs/capacitor-google-auth
// Prevents noisy warnings and side effects during Karma runs.

export const GoogleAuth = {
  initialize: (_opts?: unknown) => {
    // no-op in tests
  },
  signIn: async (_opts?: unknown) => {
    // Return a minimal shape that downstream code might expect
    return {
      authentication: {
        idToken: "test-id-token",
        accessToken: "test-access-token",
      },
      email: "test@example.com",
      id: "test",
      name: "Test User",
    } as any;
  },
  signOut: async () => undefined,
};

export default GoogleAuth;
