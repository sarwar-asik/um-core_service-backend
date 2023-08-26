import { Schema, model } from 'mongoose';
import { IStudent, IStudentModel } from './Student.interface';

const StudentSchema = new Schema<IStudent, IStudentModel>(
  {

  }
);

export const Student = model<IStudent, IStudentModel>('Student', StudentSchema);
