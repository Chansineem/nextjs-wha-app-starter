import Image from "next/image";
import { Course } from "@/services/course-service";
import {
  RiCheckboxCircleFill,
  RiPlayCircleFill,
  RiStarFill,
} from "@remixicon/react";
import { avatarColor } from "@/lib/avatar";
import { getCourseRating } from "@/lib/course-meta";

const viewsFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function CourseCard({ course }: { course: Course }) {
  const { rating, reviews } = getCourseRating(course);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow duration-200 hover:shadow-[0_4px_32px_rgba(0,0,0,0.08)]">
      {/* 16:9 thumbnail with hover play affordance + rating badge */}
      <div className="relative aspect-video w-full bg-muted">
        <Image
          alt={course.title}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          src={course.picture}
          loading="eager"
        />
        <div className="absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">
          <RiPlayCircleFill className="size-12 text-white drop-shadow" />
        </div>

        {/* Review rating — top-right */}
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-1 text-[11px] font-medium text-white backdrop-blur">
          <RiStarFill className="size-3 text-warning" />
          {rating}
          <span className="text-white/70">({reviews})</span>
        </div>
      </div>

      {/* Body — instructor avatar + title + channel + views */}
      <div className="flex gap-3 p-3">
        <span
          className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: avatarColor(course.title) }}
          aria-hidden
        >
          {course.title.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 min-h-10 text-[15px] font-medium leading-snug" title={course.title}>
            {course.title}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
            Coding Thailand
            <RiCheckboxCircleFill className="size-3.5 text-success" aria-label="ยืนยันแล้ว" />
          </p>
          {typeof course.view === "number" && (
            <p className="text-xs text-muted-foreground">
              {viewsFormatter.format(course.view)} ครั้ง
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
