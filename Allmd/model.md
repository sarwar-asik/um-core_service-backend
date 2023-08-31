
### model create with property 


### various default values of model :::::

        model user {
            <!-- for unique -->
            id          String         @id @default(uuid())
            <!-- for current time  -->
            createdAt   DateTime       @default(now())
            <!-- for updated time -->
            updatedAt   DateTime       @updatedAt
            <!-- default value -->
            credits     Int            @default(0)
            <!-- use enum -->
            status   SemesterRegistrationStatus?   @default(UPCOMING)
            dayOfWeek              WeekDays             @default(SATURDAY)

            
        }


**using enum value with a default**

        enum SemesterRegistrationStatus {UPCOMING
                                         ONGOING
                                         ENDED
                                        }

         enum WeekDays {
                            SATURDAY
                            SUNDAY
                            MONDAY
                            TUESDAY
                            WEDNESDAY
                            THURSDAY
                            FRIDAY
                        }

#### relation between multiple model (click save ) ::::

##### system-1 (simple relation) ::::

    model AcademicDepartment {
        academicFaculty   AcademicFaculty @relation(fields: [academicFacultyId], references: [id])
    }

        <!-- after (ctrl + s) -->

    model AcademicFaculty {
          academicDepartment AcademicDepartment[]
    }


#### system-2 ()  ::::::


    model CourseToPrerequisite {
        course         Course   @relation(fields: [courseID], 
            references: [id], name: "CourseToPrerequisite")
        prerequisiteId String
        prerequisite   Course   @relation(fields: [prerequisiteId],    references: [id], name: "PrerequisiteToCourse")

          @@id([courseID, prerequisiteId])
    }

    <!-- after (ctrl + s) -->

    model Course{
        Prerequisite    CourseToPrerequisite[] @relation("CourseToPrerequisite")
        PrerequisiteFor CourseToPrerequisite[] @relation("PrerequisiteToCourse")
    }