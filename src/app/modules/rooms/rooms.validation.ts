import { z } from 'zod';
const createRooms = z.object({
  body: z.object({
  
    roomNumber: z.string({
      required_error: 'roomNumber is Required (zod)',
    }),
    floor: z.string({
      required_error: 'floor is Required (zod)',
    }),
  })
})


const updateRooms = z.object({
  body: z.object({
    roomNumber: z.string({
      required_error: 'roomNumber is Required (zod)',
    }).optional(),
    floor: z.string({
      required_error: 'floor is Required (zod)',
    }).optional(),
  })
})


export const RoomsValidation = { createRooms,updateRooms}

