import Link from "next/link";
import { getCourses, type Course } from "@/services/course-service";
import { CourseCard } from "@/components/course-card";
import { RiArrowRightLine } from "@remixicon/react";

export default async function FeaturedCourses() {
  let courses: Course[] = [];
  try {
    courses = (await getCourses()).slice(0, 4);
  } catch {
    return null; // degrade gracefully if the external API is unavailable
  }

  if (courses.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight">หลักสูตรแนะนำ</h2>
        <Link
          href="/course"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-link hover:underline"
        >
          ดูทั้งหมด <RiArrowRightLine className="size-4" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
