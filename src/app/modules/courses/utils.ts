export const asyncForEach = async (array: any[], callback: any) => {
  if (!Array.isArray(array)) {
    throw new Error('Expect an array');
  }
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const hasTimeConflict = (
  existingSlots: {
    startTime: string;
    endTime: string;
    dayOfWeek: string;
  }[],

  newSlot: {
    startTime: string;
    endTime: string;
    dayOfWeek: string;
  }
) => {
  for (const slot of existingSlots) {
    //   const existingStartTime = new Date(`1970-01-01T${slot.startTime}:00`);
    //   const existingEndTime = new Date(`1970-01-01T${slot.endTime}:00`);
    //   const newStartTime = new Date(`1970-01-01T${newSlot.startTime}:00`);
    //   const newEndTime = new Date(`1970-01-01T${newSlot.endTime}:00`);

    //   console.log('the room not booked','eeeeee',existingSlots,"nnnnnn",newSlot);

    //   if (newStartTime < existingStartTime && newEndTime > existingEndTime) {
    //     // throw new ApiError(httpStatus.CONFLICT, 'The Room already booked  ');
    //     console.log('the room booked');
    //     return true
    //   }
    //   return false
    // }

    const existingStart = new Date(`1970-01-01T${slot.startTime}:00`);
    const existingEnd = new Date(`1970-01-01T${slot.endTime}:00`);
    const newStart = new Date(`1970-01-01T${newSlot.startTime}:00`);
    const newEnd = new Date(`1970-01-01T${newSlot.endTime}:00`);

    if (newStart < existingEnd && newEnd > existingStart) {
      return true;
    }
  }
};
