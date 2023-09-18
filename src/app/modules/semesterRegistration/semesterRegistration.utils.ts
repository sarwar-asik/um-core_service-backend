import { OfferedCourse } from '@prisma/client';

const getAvailableCourses = (
  offeredCourses: any[],
  studentCompleteCourses: any[],
  studentCurrentlyTakenCourses: any[]
) => {
  // console.log("availableCourse",offeredCourse,studentCompleteCourses,studentCurrentlyTakenCourses);
  //   console.log(studentCurrentlyTakenCourses);
  const completedCoursesId = studentCompleteCourses.map(
    (course: any) => course?.id
  );
  // console.log(completedCoursesId);
  const availableCourseList = offeredCourses
    ?.filter(
      (offeredCourse: OfferedCourse) =>
        !completedCoursesId.includes(offeredCourse.courseId)
    )
    ?.filter(course => {
      const preRequisites = course.course.preRequisite;
      //   console.log(preRequisites);
      if (preRequisites?.length === 0) {
        return true;
      } else {
        const preRequisiteIds = preRequisites?.map(
          (preRequisite: any) => preRequisite.preRequisiteId
        );
        // console.log(preRequisiteIds);
        // ! !important every with return true or false for your condition
        return preRequisiteIds?.every((id: string) =>
          preRequisiteIds.includes(id)
        );
      }
    })
    .map((course:any)=>{
      const isAlreadyTakenCourse = studentCurrentlyTakenCourses.find((c:any)=>c.offeredCourseId === course?.id)
      if(isAlreadyTakenCourse){
        course.offeredCourseSections.map((section:any)=>{
          if(section?.id === isAlreadyTakenCourse.offeredCourseSectionId){
            section.isTaken = true
          }
          else{
            section.isTaken = false
          }
        })
        return {
          ...course,
          isTaken:true
        }
      }
      else{
        course?.offeredCourseSections?.map((section:any)=>{
          section.isTaken = false
        })
        return {
          ...course,
          isTaken:false
        }
      }
    })

  // console.log(availableCourseList);

  return availableCourseList;
};

export const SemesterRegistrationUtils = {
  getAvailableCourses,
};
