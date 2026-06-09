// src/services/course-service.ts

const COURSE_API_URL = "https://api.codingthailand.com/api/course";

export type Course = {
  id: number;
  title: string;
  detail: string;
  picture: string;
  view?: number;
  created_at?: string;
  updated_at?: string;
};

type CourseListResponse = {
  data: Course[];
};

/**
 * Fetch the list of courses from the Coding Thailand API.
 */
export async function getCourses(): Promise<Course[]> {
  const response = await fetch(COURSE_API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`);
  }

  const courseResponse: CourseListResponse = await response.json();

  return courseResponse.data;
}
