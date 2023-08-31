export const OfferedCourseClassScheduleSearchableFields = ['dayOfWeek'];


// used in service ?:::::


export const offeredCourseClassScheduleRelationalFields = [
  'offeredCourseSectionId',
  'semesterRegistrationId',
  'facultyId',
  'roomId',
];


// write schema model name with carefully these are foreiggn key

export const offeredCourseClassScheduleRelationalFieldsMapper:{[key:string]:string} ={
    offeredCourseSectionId:'offeredCourseSection',
    facultyId:'faculty',
    roomId:'room',
    semesterRegistrationId:'semesterRegistration'

}


// used in controller ::::


export const offeredCourseClassScheduleFilterableFields = [
    'searchTerm',
    'dayOfWeek',
    'offeredCourseSectionId',
    'semesterRegistrationId',
    'roomId',
    'facultyId'
]