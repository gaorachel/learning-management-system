import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params: { courseId, chapterId },
  }: {
    params: {
      courseId: string;
      chapterId: string;
    };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorised", { status: 401 });

    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!ownCourse) return new NextResponse("Unauthorised", { status: 401 });

    const unpublishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: false,
      },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });

    /* 
        Not only unpublish the chapter, if this chapter is the only one in a course which has been published, then the whole course should switch to unpublished as well.
    */
    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
