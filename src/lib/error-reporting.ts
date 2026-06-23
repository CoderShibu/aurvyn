export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") {
    console.error("[Server Error]", error, context);
    return;
  }
  console.error("[Client Error]", error, {
    route: window.location.pathname,
    ...context,
  });
}
