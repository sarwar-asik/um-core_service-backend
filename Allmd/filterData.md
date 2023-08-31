

#### course>course.controller.ts :::::


    // ! filter data 


    const getAllDb = catchAsync(async (req: Request, res: Response) => {
       
        const filters = pick(req.query,CourseFilterableFields);
  
        const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);


        const result = await CoursesService.getAllDb(filters, options);

        sendResponse<Course[]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Successfully get Courses Data',
            meta: result.meta,
            data: result?.data,
        });
    });

#### course>course.service.ts :::::

    const getAllDb = async (
    filters: ICourseFilterRequest,
    options: IPaginationOptions
    ): Promise<IGenericResponse<Course[]>> => {
    // !for pagination
    const { page, limit, skip } = paginationHelpers.calculatePagination(options);

 

    const { searchTerm, ...filtersData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
        OR: CourseSearchableFields.map(field => ({
            [field]: {
            contains: searchTerm,
            mode: 'insensitive',
            },
        })),
        });
    }
    
    // if (Object.keys(filtersData).length > 0) {
    //   andConditions.push({
    //     AND: Object.keys(filtersData).map(key => ({
    //       [key]: {
    //         equals: (filtersData as any)[key],
    //       },
    //     })),
    //   });
    // }

    
    if (Object.keys(filtersData).length > 0) {
        andConditions.push({
            AND: Object.keys(filtersData).map((key) => {
                if (CourseRelationalFields.includes(key)) {
                    return {
                        [CourseRelationalFieldsMapper[key]]: {
                            id: (filtersData as any)[key]
                        }
                    };
                } else {
                    return {
                        [key]: {
                            equals: (filtersData as any)[key]
                        }
                    };
                }
            })
        });
    }


    // for andCondition for where

    const whereCondition: Prisma.CourseWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.Course.findMany({
        where: whereCondition,
        skip,
        take: limit,

        orderBy:
        options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: 'desc',
            },
            include:{
                faculty:true,
                offeredCourseSection:true,
                room:true,
                semesterRegistration:true,
                
            }
    });
    const total = await prisma.academicSemester.count();
    return {
        meta: {
        total,
        page,
        limit,
        },
        data: result,
    };
    };


### modules>course.interface.ts >>>>>



    export type ICourseFilterRequest = {
        searchTerm?: string | null;
        roomId?: string | null;
        semesterRegistrationId?: string | null;
        facultyId?: string | null;

        offeredCourseSectionId?: string | null;
    };


### modules>course.constant.ts >>>>>


    export const CourseSearchableFields = ['dayOfWeek'];

    export const CourseRelationalFields = [
        'offeredCourseSectionId',
        'semesterRegistrationId',
        'facultyId',
        'roomId',
    ];


    // write schema model name with carefully these are foreiggn key

    export const CourseRelationalFieldsMapper:{[key:string]:string} ={
        offeredCoursesId:'offeredCourses',
        facultyId:'faculty',
        roomId:'room',
        semesterRegistrationId:'semesterRegistration'
    }