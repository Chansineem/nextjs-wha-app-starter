import FeaturesCourse from "@/components/features-course";
import { getCourses } from "@/services/course-service";
import { getCourseGroup } from "@/lib/course-meta";

type SearchParams = Promise<{ group?: string }>;

// http://localhost:3000/course
export default async function CoursePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { group } = await searchParams;
  const courses = await getCourses();

  const groups = [...new Set(courses.map(getCourseGroup))];
  const filtered = group
    ? courses.filter((course) => getCourseGroup(course) === group)
    : courses;

  return (
    <main>
      <FeaturesCourse courses={filtered} groups={groups} activeGroup={group} />
    </main>
  );
}
