import { z } from 'zod';

// User roles enum
export const userRoleSchema = z.enum(['admin', 'guru', 'siswa']);
export type UserRole = z.infer<typeof userRoleSchema>;

// Attendance status enum  
export const attendanceStatusSchema = z.enum(['hadir', 'tidak_hadir', 'izin', 'sakit', 'alpa']);
export type AttendanceStatus = z.infer<typeof attendanceStatusSchema>;

// Leave request status enum
export const leaveRequestStatusSchema = z.enum(['pending', 'approved', 'rejected']);
export type LeaveRequestStatus = z.infer<typeof leaveRequestStatusSchema>;

// Leave request type enum
export const leaveRequestTypeSchema = z.enum(['izin', 'sakit']);
export type LeaveRequestType = z.infer<typeof leaveRequestTypeSchema>;

// Day of week enum
export const dayOfWeekSchema = z.enum(['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']);
export type DayOfWeek = z.infer<typeof dayOfWeekSchema>;

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  password_hash: z.string(),
  role: userRoleSchema,
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});
export type User = z.infer<typeof userSchema>;

// Class schema
export const classSchema = z.object({
  id: z.number(),
  name: z.string(),
  grade: z.string(),
  academic_year: z.string(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});
export type Class = z.infer<typeof classSchema>;

// Teacher schema
export const teacherSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  nip: z.string(),
  full_name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});
export type Teacher = z.infer<typeof teacherSchema>;

// Student schema
export const studentSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  nisn: z.string(),
  full_name: z.string(),
  class_id: z.number(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  parent_name: z.string().nullable(),
  parent_phone: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});
export type Student = z.infer<typeof studentSchema>;

// Teacher class assignment schema
export const teacherClassSchema = z.object({
  id: z.number(),
  teacher_id: z.number(),
  class_id: z.number(),
  is_homeroom: z.boolean(),
  academic_year: z.string(),
  created_at: z.coerce.date()
});
export type TeacherClass = z.infer<typeof teacherClassSchema>;

// Schedule schema
export const scheduleSchema = z.object({
  id: z.number(),
  class_id: z.number(),
  day_of_week: dayOfWeekSchema,
  start_time: z.string(), // HH:mm format
  end_time: z.string(), // HH:mm format
  subject: z.string(),
  teacher_id: z.number().nullable(),
  academic_year: z.string(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});
export type Schedule = z.infer<typeof scheduleSchema>;

// Attendance schema
export const attendanceSchema = z.object({
  id: z.number(),
  student_id: z.number(),
  class_id: z.number(),
  date: z.coerce.date(),
  status: attendanceStatusSchema,
  check_in_time: z.coerce.date().nullable(),
  check_out_time: z.coerce.date().nullable(),
  notes: z.string().nullable(),
  created_by: z.number(), // user_id who created this record
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});
export type Attendance = z.infer<typeof attendanceSchema>;

// Leave request schema
export const leaveRequestSchema = z.object({
  id: z.number(),
  student_id: z.number(),
  type: leaveRequestTypeSchema,
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  reason: z.string(),
  attachment_url: z.string().nullable(),
  status: leaveRequestStatusSchema,
  approved_by: z.number().nullable(), // user_id who approved/rejected
  approved_at: z.coerce.date().nullable(),
  approval_notes: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});
export type LeaveRequest = z.infer<typeof leaveRequestSchema>;

// Input schemas for authentication
export const loginInputSchema = z.object({
  identifier: z.string(), // NISN, NIP, or username
  password: z.string(),
  role: userRoleSchema
});
export type LoginInput = z.infer<typeof loginInputSchema>;

// Input schemas for user management
export const createUserInputSchema = z.object({
  username: z.string(),
  password: z.string(),
  role: userRoleSchema
});
export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const updateUserInputSchema = z.object({
  id: z.number(),
  username: z.string().optional(),
  password: z.string().optional(),
  is_active: z.boolean().optional()
});
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

// Input schemas for class management
export const createClassInputSchema = z.object({
  name: z.string(),
  grade: z.string(),
  academic_year: z.string()
});
export type CreateClassInput = z.infer<typeof createClassInputSchema>;

export const updateClassInputSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  grade: z.string().optional(),
  academic_year: z.string().optional(),
  is_active: z.boolean().optional()
});
export type UpdateClassInput = z.infer<typeof updateClassInputSchema>;

// Input schemas for teacher management
export const createTeacherInputSchema = z.object({
  nip: z.string(),
  full_name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  username: z.string(),
  password: z.string()
});
export type CreateTeacherInput = z.infer<typeof createTeacherInputSchema>;

export const updateTeacherInputSchema = z.object({
  id: z.number(),
  nip: z.string().optional(),
  full_name: z.string().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  is_active: z.boolean().optional()
});
export type UpdateTeacherInput = z.infer<typeof updateTeacherInputSchema>;

// Input schemas for student management
export const createStudentInputSchema = z.object({
  nisn: z.string(),
  full_name: z.string(),
  class_id: z.number(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  parent_name: z.string().nullable(),
  parent_phone: z.string().nullable(),
  username: z.string(),
  password: z.string()
});
export type CreateStudentInput = z.infer<typeof createStudentInputSchema>;

export const updateStudentInputSchema = z.object({
  id: z.number(),
  nisn: z.string().optional(),
  full_name: z.string().optional(),
  class_id: z.number().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  parent_name: z.string().nullable().optional(),
  parent_phone: z.string().nullable().optional(),
  is_active: z.boolean().optional()
});
export type UpdateStudentInput = z.infer<typeof updateStudentInputSchema>;

// Input schemas for teacher-class assignments
export const assignTeacherToClassInputSchema = z.object({
  teacher_id: z.number(),
  class_id: z.number(),
  is_homeroom: z.boolean(),
  academic_year: z.string()
});
export type AssignTeacherToClassInput = z.infer<typeof assignTeacherToClassInputSchema>;

// Input schemas for schedule management
export const createScheduleInputSchema = z.object({
  class_id: z.number(),
  day_of_week: dayOfWeekSchema,
  start_time: z.string(),
  end_time: z.string(),
  subject: z.string(),
  teacher_id: z.number().nullable(),
  academic_year: z.string()
});
export type CreateScheduleInput = z.infer<typeof createScheduleInputSchema>;

export const updateScheduleInputSchema = z.object({
  id: z.number(),
  class_id: z.number().optional(),
  day_of_week: dayOfWeekSchema.optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  subject: z.string().optional(),
  teacher_id: z.number().nullable().optional(),
  academic_year: z.string().optional(),
  is_active: z.boolean().optional()
});
export type UpdateScheduleInput = z.infer<typeof updateScheduleInputSchema>;

// Input schemas for attendance management
export const checkInInputSchema = z.object({
  student_id: z.number(),
  class_id: z.number(),
  date: z.coerce.date()
});
export type CheckInInput = z.infer<typeof checkInInputSchema>;

export const checkOutInputSchema = z.object({
  student_id: z.number(),
  date: z.coerce.date()
});
export type CheckOutInput = z.infer<typeof checkOutInputSchema>;

export const markAttendanceInputSchema = z.object({
  student_id: z.number(),
  class_id: z.number(),
  date: z.coerce.date(),
  status: attendanceStatusSchema,
  notes: z.string().nullable()
});
export type MarkAttendanceInput = z.infer<typeof markAttendanceInputSchema>;

export const getAttendanceInputSchema = z.object({
  student_id: z.number().optional(),
  class_id: z.number().optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional()
});
export type GetAttendanceInput = z.infer<typeof getAttendanceInputSchema>;

// Input schemas for leave requests
export const createLeaveRequestInputSchema = z.object({
  student_id: z.number(),
  type: leaveRequestTypeSchema,
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  reason: z.string(),
  attachment_url: z.string().nullable()
});
export type CreateLeaveRequestInput = z.infer<typeof createLeaveRequestInputSchema>;

export const approveLeaveRequestInputSchema = z.object({
  id: z.number(),
  status: z.enum(['approved', 'rejected']),
  approval_notes: z.string().nullable()
});
export type ApproveLeaveRequestInput = z.infer<typeof approveLeaveRequestInputSchema>;

// Query input schemas
export const getStudentsByClassInputSchema = z.object({
  class_id: z.number()
});
export type GetStudentsByClassInput = z.infer<typeof getStudentsByClassInputSchema>;

export const getTeacherClassesInputSchema = z.object({
  teacher_id: z.number(),
  academic_year: z.string().optional()
});
export type GetTeacherClassesInput = z.infer<typeof getTeacherClassesInputSchema>;

export const getAttendanceReportInputSchema = z.object({
  class_id: z.number().optional(),
  student_id: z.number().optional(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  format: z.enum(['json', 'pdf', 'excel']).optional().default('json')
});
export type GetAttendanceReportInput = z.infer<typeof getAttendanceReportInputSchema>;

// Dashboard statistics schema
export const dashboardStatsSchema = z.object({
  total_students: z.number(),
  total_teachers: z.number(),
  total_classes: z.number(),
  today_attendance_rate: z.number(),
  weekly_attendance_trend: z.array(z.object({
    date: z.string(),
    present: z.number(),
    absent: z.number(),
    rate: z.number()
  }))
});
export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

// Profile update schemas
export const updateStudentProfileInputSchema = z.object({
  student_id: z.number(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  parent_name: z.string().nullable().optional(),
  parent_phone: z.string().nullable().optional()
});
export type UpdateStudentProfileInput = z.infer<typeof updateStudentProfileInputSchema>;

export const updateTeacherProfileInputSchema = z.object({
  teacher_id: z.number(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional()
});
export type UpdateTeacherProfileInput = z.infer<typeof updateTeacherProfileInputSchema>;

export const changePasswordInputSchema = z.object({
  user_id: z.number(),
  current_password: z.string(),
  new_password: z.string()
});
export type ChangePasswordInput = z.infer<typeof changePasswordInputSchema>;