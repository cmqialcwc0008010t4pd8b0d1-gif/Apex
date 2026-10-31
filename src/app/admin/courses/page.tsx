import prisma from "@/lib/prisma";
import AdminCoursesClientView from "./AdminCoursesClientView";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      modules: {
        include: {
          articles: true,
        },
      },
      games: true,
    },
    orderBy: { orderIndex: "asc" },
  });

  return <AdminCoursesClientView courses={courses} />;
}
