import Student from "../models/Student";
import Attendance from "../models/Attendance";
import Course from "../models/Course";
import Teacher from "../models/Teacher";
import Notice from "../models/Notice";

// Get one student with courses, teachers, and attendance
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

// Count students in a semester
export const getStudentCountBySemester = async (semester: number) => {
  return await Student.countDocuments({
    semester,
  });
};

// Get all students in a semester
export const getStudentsBySemester = async (semester: number) => {
  return await Student.find({
    semester,
  })
    .select("name email rollNumber semester gpa")
    .lean();
};

// Get student by email
export const getStudentByEmail = async (email: string) => {
  return await Student.findOne({
    email: {
      $regex: `^${email}$`,
      $options: "i",
    },
  })
    .populate({
      path: "courses",
      populate: {
        path: "teacher",
      },
    })
    .lean();
};

// Get all students
export const getAllStudents = async () => {
  return await Student.find()
    .select("name email rollNumber semester gpa")
    .lean();
};

// Count all students
export const getTotalStudentCount = async () => {
  return await Student.countDocuments();
};



// =========================
// ATTENDANCE
// =========================

export const getStudentAttendance = async (name: string) => {
  const student = await Student.findOne({
    name: {
      $regex: name,
      $options: "i",
    },
  }).lean();

  if (!student) {
    return null;
  }

  const attendance = await Attendance.find({
    student: student._id,
  }).lean();

  return {
    student: {
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber,
      semester: student.semester,
    },
    attendance,
  };
};

export const getAttendanceBySemester = async (
  semester: number,
) => {
  return await Attendance.find({
    semester,
  }).lean();
};

// =========================
// COURSE
// =========================

export const getAllCourses = async () => {
  return await Course.find()
    .populate("teacher")
    .lean();
};

export const getCourseByName = async (
  name: string,
) => {
  return await Course.findOne({
    name: {
      $regex: name,
      $options: "i",
    },
  })
    .populate("teacher")
    .lean();
};

// =========================
// TEACHER
// =========================

export const getAllTeachers = async () => {
  return await Teacher.find().lean();
};

export const getTeacherByName = async (
  name: string,
) => {
  return await Teacher.findOne({
    name: {
      $regex: name,
      $options: "i",
    },
  }).lean();
};

// =========================
// NOTICE
// =========================

export const getAllNotices = async () => {
  return await Notice.find()
    .sort({
      createdAt: -1,
    })
    .lean();
};

export const getLatestNotices = async () => {
  return await Notice.find()
    .sort({
      createdAt: -1,
    })
    .limit(5)
    .lean();
};