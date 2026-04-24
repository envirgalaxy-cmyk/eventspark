import { Layout } from "@/components/layout/Layout";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Lazy page imports
import { Suspense, lazy } from "react";

const HomePage = lazy(() => import("@/pages/HomePage"));
const EventsPage = lazy(() => import("@/pages/EventsPage"));
const EventDetailPage = lazy(() => import("@/pages/EventDetailPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));

// Root route with Layout
const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <HomePage />
    </Suspense>
  ),
});

const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <EventsPage />
    </Suspense>
  ),
});

const eventDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/$id",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <EventDetailPage />
    </Suspense>
  ),
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout/$eventId",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <CheckoutPage />
    </Suspense>
  ),
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ContactPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  eventsRoute,
  eventDetailRoute,
  checkoutRoute,
  contactRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" richColors />
    </QueryClientProvider>
  );
}
