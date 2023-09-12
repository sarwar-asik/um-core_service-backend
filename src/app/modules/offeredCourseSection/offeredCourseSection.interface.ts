import { WeekDays } from "@prisma/client";

export type IOfferedCourseSectionFilterRequest = {
  searchTerm?: string | undefined;
  offeredCourseId?: string | undefined;
};



type ClassSchedule= {
    startTime: string;
    endTime: string;
    dayOfWeek: WeekDays
    roomId: string;
    facultyId: string;
  }
  
  export type  IOfferedCourseSectionCreate ={
    title: string;
    maxCapacity: number;
    offeredCourseId: string;
    currentlyEnrolledStudent: number;
    classSchedules: ClassSchedule[];
  }
  