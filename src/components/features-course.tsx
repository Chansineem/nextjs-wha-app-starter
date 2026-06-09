import { Course } from "@/services/course-service";
import { CourseCard } from "@/components/course-card";
import { Chip } from "@/components/chip";

type Props = {
  courses: Course[];
  groups?: string[];
  activeGroup?: string;
};

const FeaturesCourse = ({ courses, groups = [], activeGroup }: Props) => {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h1 className="text-2xl font-bold tracking-tight">หลักสูตรทั้งหมด</h1>
        <span className="text-sm text-muted-foreground">{courses.length} คอร์ส</span>
      </div>

      {/* Group filter chip bar */}
      {groups.length > 0 && (
        <nav className="-mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6">
          <Chip href="/course" active={!activeGroup}>
            ทั้งหมด
          </Chip>
          {groups.map((group) => (
            <Chip
              key={group}
              href={{ pathname: "/course", query: { group } }}
              active={activeGroup === group}
            >
              {group}
            </Chip>
          ))}
        </nav>
      )}

      {courses.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border px-6 py-16 text-center text-muted-foreground">
          ไม่พบหลักสูตรในกลุ่มนี้
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturesCourse;
