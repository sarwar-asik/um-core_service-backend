const getGradeFromMarks = (marks: number) => {

  let result:{grade:string,point:number} = {grade:'', point:0}


  if (marks >= 0 && marks <= 33) {
    result = {
      grade: 'F',
      point:0
      
    };
  } else if (marks >= 34 && marks <= 49) {
    result = {
      grade: 'D',
      point:2.00
    };
  } else if (marks >= 50 && marks <= 59) {
    result = {
      grade: 'C',
      point:2.50
    };
  } else if (marks >= 60 && marks <= 69) {
    result = {
      grade: 'B',
      
      point:3.00
    };
  } else if (marks >= 70 && marks <= 79) {
    result = {
      grade: 'A',
      point:3.5
    };
  } else if (marks >= 80 && marks <= 100) {
    result = {
      grade: 'A+',
      point:4.00
    };
  }
  return result
};

export const studentEnrollCourseMarkUtils = { getGradeFromMarks };
