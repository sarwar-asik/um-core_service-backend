// ! for enrollment ///

import { SemesterRegistrationStatus } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { IEnrollCoursePayload } from '../semesterRegistration/semesterRegistration.interface';

const enrollIntoCourse = async (
  id: string,
  payload: IEnrollCoursePayload
): Promise<{ message: string }> => {
  //  console.log(id,payload,"from enroll");

  const student = await prisma.student.findFirst({
    where: {
      studentId: id,
    },
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }
  //  console.log(student);
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'semesterRegistration not found');
  }
  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload?.offeredCourseId,
    },
    include: {
      course: true,
    },
  });

  if (!offeredCourse) {
    throw new ApiError(httpStatus.NOT_FOUND, 'offered course not found');
  }

  const offeredCourseSection = await prisma.offeredCourseSection.findFirst({
    where: {
      id: payload?.offeredCourseSectionId,
    },
  });

  if (!offeredCourseSection) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'offered course  sectionnot found'
    );
  }

  // console.log(semesterRegistration);
  // console.log(semesterRegistration?.id);

  if (
    offeredCourseSection.maxCapacity &&
    offeredCourseSection.currentlyEnrolledStudent &&
    offeredCourseSection.currentlyEnrolledStudent >=
      offeredCourseSection.maxCapacity
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'student capacity is full');
  }

  // console.log( {
  //   studentId:student?.id,
  //   semesterRegistrationId:semesterRegistration?.id,
  //   offeredCourseId:payload.offeredCourseId,
  //   offeredCourseSectionId:payload?.offeredCourseSectionId
  // },"studentSemesterRegistrationCourse");

  // ! with transaction
  await prisma.$transaction(async transactionClient => {
    await transactionClient.studentSemesterRegistrationCourse.create({
      data: {
        studentId: student?.id,
        semesterRegistrationId: semesterRegistration?.id,
        offeredCourseId: payload.offeredCourseId,
        offeredCourseSectionId: payload?.offeredCourseSectionId,
      },
    });
    await transactionClient.offeredCourseSection.update({
      where: {
        id: payload?.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          increment: 1,
        },
      },
    });

    await transactionClient.studentSemesterRegistration.updateMany({
      where: {
        // student: {
        //   studentId: student?.id,
        // },
        // semesterRegistration: {
        //   id: semesterRegistration?.id,
        // },
        semesterRegistrationId: semesterRegistration?.id,
        studentId: student?.id,
      },
      data: {
        totalCreditsTaken: {
          increment: offeredCourse?.course.credits,
        },
      },
    });
  });

  return {
    message: 'successfully created enroll',
  };
  // const enrollCourse  = await prisma.studentSemesterRegistrationCourse.create({data:
  //   {
  //     studentId:student?.id,
  //     semesterRegistrationId:semesterRegistration?.id,
  //     offeredCourseId:payload.offeredCourseId,
  //     offeredCourseSectionId:payload?.offeredCourseSectionId
  //   }
  // })

  //  return enrollCourse
};

// ! for withdraw ////

const withdrawFromCourse = async (
  id: string,
  payload: IEnrollCoursePayload
): Promise<{ message: string }> => {
  //  console.log(id,payload,"from enroll");

  const student = await prisma.student.findFirst({
    where: {
      studentId: id,
    },
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }
  //  console.log(student);
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'semesterRegistration not found');
  }
  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload?.offeredCourseId,
    },
    include: {
      course: true,
    },
  });

  if (!offeredCourse) {
    throw new ApiError(httpStatus.NOT_FOUND, 'offered course not found');
  }

  // ! with transaction
  await prisma.$transaction(async transactionClient => {
    // ! very important to deleteMany ////

    await transactionClient.studentSemesterRegistrationCourse.delete({
      where: {
        semesterRegistrationId_studentId_offeredCourseId: {
          semesterRegistrationId: semesterRegistration?.id,
          studentId: student?.id,
          offeredCourseId: payload.offeredCourseId,
        },
      },
    });
    await transactionClient.offeredCourseSection.update({
      where: {
        id: payload?.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          decrement: 1,
        },
      },
    });
    console.log(offeredCourse?.course.credits, 'offeredCourse?.course.credits');

    await transactionClient.studentSemesterRegistration.updateMany({
      where: {
        // student: {
        //   studentId: student?.id,
        // },
        // semesterRegistration: {
        //   id: semesterRegistration?.id,
        // },
        semesterRegistrationId: semesterRegistration?.id,
        studentId: student?.id,
      },
      data: {
        totalCreditsTaken: {
          decrement: offeredCourse?.course.credits,
        },
      },
    });
  });

  return {
    message: 'successfully withdraw from course',
  };
  // const enrollCourse  = await prisma.studentSemesterRegistrationCourse.create({data:
  //   {
  //     studentId:student?.id,
  //     semesterRegistrationId:semesterRegistration?.id,
  //     offeredCourseId:payload.offeredCourseId,
  //     offeredCourseSectionId:payload?.offeredCourseSectionId
  //   }
  // })

  //  return enrollCourse
};

export const studentSemesterRegistrationCourseService = {
  enrollIntoCourse,
  withdrawFromCourse,
};
