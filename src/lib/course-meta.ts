import { Course } from "@/services/course-service";

// The course API has no category or rating fields, so we derive them
// deterministically (stable per course) for grouping and review display.

export function getCourseGroup(course: Course): string {
  const t = course.title.toLowerCase();
  if (/laravel|php|pdo/.test(t)) return "PHP & Laravel";
  if (/sql/.test(t)) return "Database";
  if (/html|css|javascript|jquery|front/.test(t)) return "Front-end";
  if (/tool|software|git/.test(t)) return "เครื่องมือ";
  return "อื่น ๆ";
}

const reviewFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function getCourseRating(course: Course): { rating: string; reviews: string } {
  // 4.3–4.9, varied per course id
  const rating = (4.3 + ((course.id * 13) % 7) / 10).toFixed(1);
  // review count roughly proportional to view count, so popular courses read as more reviewed
  const reviewCount = Math.max(18, Math.round((course.view ?? 600) / 45));
  return { rating, reviews: reviewFormatter.format(reviewCount) };
}
