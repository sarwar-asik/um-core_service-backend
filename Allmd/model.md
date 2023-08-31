
### model create with property 

             
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