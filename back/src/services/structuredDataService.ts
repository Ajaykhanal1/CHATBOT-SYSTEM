import Student from "../models/Student";

export const getStudentData = async (email: string) => {
  return await Student.findOne({ email }).lean();
};