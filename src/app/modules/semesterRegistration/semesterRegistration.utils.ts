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
      if(preRequisites?.length === 0){
        return true;

      }else{
        const preRequisiteIds = preRequisites?.map((preRequisite:any)=>preRequisite.preRequisiteId)
        console.log(preRequisiteIds);

      }
    })

  // console.log(availableCourseList);

  return availableCourseList;
};

export const SemesterRegistrationUtils = {
  getAvailableCourses,
};
