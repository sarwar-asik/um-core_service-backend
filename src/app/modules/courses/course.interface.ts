export type ICourseCreateData = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses:IPrerequisiteCourseRequest[]
  
  // [
  //   {
  //     courseID: string;

  //     isDeleted?: null;
  //   }
  // ];
};

export type IPrerequisiteCourseRequest = {
  courseID: string;
  isDeleted?: null;
};
