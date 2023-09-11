import { Course, StudentEnrolledCourse } from '@prisma/client';

const getGradeFromMarks = (marks: number) => {
  let result: { grade: string; point: number } = { grade: '', point: 0 };

  if (marks >= 0 && marks <= 33) {
    result = {
      grade: 'F',
      point: 0,
    };
  } else if (marks >= 34 && marks <= 49) {
    result = {
      grade: 'D',
      point: 2.0,
    };
  } else if (marks >= 50 && marks <= 59) {
    result = {
      grade: 'C',
      point: 2.5,
    };
  } else if (marks >= 60 && marks <= 69) {
    result = {
      grade: 'B',

      point: 3.0,
    };
  } else if (marks >= 70 && marks <= 79) {
    result = {
      grade: 'A',
      point: 3.5,
    };
  } else if (marks >= 80 && marks <= 100) {
    result = {
      grade: 'A+',
      point: 4.0,
    };
  }
  return result;
};

const calcCGPAandGrade = (
  payload: (StudentEnrolledCourse & { course: Course })[]
) => {
  console.log(payload);
//   const result = {
//     totalCompletedCredit: 0,
//     cgpa: 0,
//   };
// console.log(result);

  if (payload.length === 0) {
    return {
      totalCompletedCredit: 0,
      cgpa: 0,
    };
  }

  let totalCredits = 0;
  let totalCGPA = 0;

  for (const grade of payload) {
    // console.log(grade);
    totalCredits += grade.course.credits || 0;

    totalCGPA += grade.point || 0;

    console.log(totalCGPA, totalCredits);
  }
  const avgCGPA = Number((totalCGPA / payload.length).toFixed(2))
//   console.log(avgCGPA);

  return {
    totalCompletedCredit: totalCredits,
    cgpa: avgCGPA,
  };
};

export const studentEnrollCourseMarkUtils = {
  getGradeFromMarks,
  calcCGPAandGrade,
};
