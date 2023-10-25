import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/ui/banner";
import { Separator } from "@/components/ui/separator";

import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";

const ChapterIdPage = async ({
  params: { courseId, chapterId },
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) return redirect("/");

  const { chapter, course, muxData, attachments, nextChapter, userProgress, purchase } = await getChapter({
    userId,
    courseId,
    chapterId,
  });

  if (!chapter || !course) redirect("/");

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && <Banner variant="success" label="You already completed this chapter" />}
      {isLocked && <Banner variant="warning" label="You need to purchase this course to watch this chapter" />}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            title={chapter.title}
            courseId={courseId}
            chapterId={chapterId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2"> {chapter.title} </h2>
            {purchase ? (
              <CourseProgressButton
                courseId={courseId}
                chapterId={chapterId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton courseId={courseId} price={course.price!} />
            )}
          </div>
          <Separator />
        </div>
        <Preview value={chapter.description!} />
      </div>
      {!!attachments.length && (
        <>
          <Separator />
          <div className="p-4">
            {attachments.map((attachment) => (
              <a
                href={attachment.url}
                target="_blank"
                key={attachment.id}
                className="flex items-center p3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
              >
                <File />
                <p className="line-clamp-1"> {attachment.name} </p>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ChapterIdPage;
