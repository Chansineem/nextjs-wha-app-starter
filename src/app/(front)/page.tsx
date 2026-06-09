import { Suspense } from "react";
import Hero from "@/components/hero";
import FeaturedCourses from "@/components/featured-courses";

// http://localhost:3000/
export default function Home() {
  return (
    <>
      <Hero />
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6">
            <div className="h-7 w-48 animate-pulse rounded-md bg-muted" />
            <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col">
                  <div className="aspect-video w-full animate-pulse rounded-xl bg-muted" />
                  <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        }
      >
        <FeaturedCourses />
      </Suspense>
    </>
  );
}
