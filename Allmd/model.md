
### model create with property 

             
        model user {
            id          String         @id @default(uuid())
            <!-- for unique -->
            createdAt   DateTime       @default(now())
            <!-- for current time  -->
            updatedAt   DateTime       @updatedAt
            <!-- for updated time -->
            credits     Int            @default(0)
            <!-- default value -->
            status   SemesterRegistrationStatus?   @default(UPCOMING)

            
        }


**using enum value with a default**

        enum SemesterRegistrationStatus {UPCOMING
                                         ONGOING
                                         ENDED
                                        }