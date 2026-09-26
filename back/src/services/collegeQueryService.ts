import Student from "../models/Student";
import Attendance from "../models/Attendance";

export const getStudentByName = async (name: string) => {
  const student = await Student.findOne({
    name: {
      $regex: name,
      $options: "i",
    },
  }).populate({
    path: "courses",
    populate: {
      path: "teacher",
    },
  });

  if (!student) {
    return null;
  }

  const attendance = await Attendance.find({
    student: student._id,
  });

  return {
    student,
    attendance,
  };
};