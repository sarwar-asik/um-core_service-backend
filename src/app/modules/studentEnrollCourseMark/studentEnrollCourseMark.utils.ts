const getGradeFromMarks = (marks: number) => {

  let result:{grade:string} = {grade:''}


  if (marks >= 0 && marks <= 33) {
    result = {
      grade: 'F',
    };
  } else if (marks >= 34 && marks <= 49) {
    result = {
      grade: 'D',
    };
  } else if (marks >= 50 && marks <= 59) {
    result = {
      grade: 'C',
    };
  } else if (marks >= 60 && marks <= 69) {
    result = {
      grade: 'B',
    };
  } else if (marks >= 70 && marks <= 79) {
    result = {
      grade: 'A',
    };
  } else if (marks >= 80 && marks <= 100) {
    result = {
      grade: 'A+',
    };
  }
  return result
};

export const studentEnrollCourseMarkUtils = { getGradeFromMarks };
