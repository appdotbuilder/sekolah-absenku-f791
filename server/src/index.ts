import { initTRPC, TRPCError } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  loginInputSchema,
  createUserInputSchema,
  updateUserInputSchema,
  changePasswordInputSchema,
  createClassInputSchema,
  updateClassInputSchema,
  createTeacherInputSchema,
  updateTeacherInputSchema,
  assignTeacherToClassInputSchema,
  getTeacherClassesInputSchema,
  updateTeacherProfileInputSchema,
  createStudentInputSchema,
  updateStudentInputSchema,
  getStudentsByClassInputSchema,
  updateStudentProfileInputSchema,
  checkInInputSchema,
  checkOutInputSchema,
  markAttendanceInputSchema,
  getAttendanceInputSchema,
  getAttendanceReportInputSchema,
  createLeaveRequestInputSchema,
  approveLeaveRequestInputSchema,
  createScheduleInputSchema,
  updateScheduleInputSchema,
  dayOfWeekSchema
} from './schema';

// Import handlers
import { login, verifyToken } from './handlers/auth';
import { 
  createUser, 
  updateUser, 
  getUsers, 
  getUserById, 
  changePassword, 
  deleteUser 
} from './handlers/user_management';
import { 
  createClass, 
  updateClass, 
  getClasses, 
  getClassById, 
  getClassesByYear, 
  deleteClass 
} from './handlers/class_management';
import { 
  createTeacher, 
  updateTeacher, 
  getTeachers, 
  getTeacherById, 
  getTeacherByNip, 
  assignTeacherToClass, 
  getTeacherClasses, 
  removeTeacherFromClass, 
  updateTeacherProfile, 
  deleteTeacher 
} from './handlers/teacher_management';
import { 
  createStudent, 
  updateStudent, 
  getStudents, 
  getStudentById, 
  getStudentByNisn, 
  getStudentsByClass, 
  updateStudentProfile, 
  transferStudent, 
  deleteStudent 
} from './handlers/student_management';
import { 
  checkIn, 
  checkOut, 
  markAttendance, 
  getAttendance, 
  getTodayAttendanceByClass, 
  getStudentAttendanceHistory, 
  getAttendanceStats, 
  generateAttendanceReport, 
  bulkMarkAttendance 
} from './handlers/attendance_management';
import { 
  createLeaveRequest, 
  getLeaveRequests, 
  getLeaveRequestById, 
  approveLeaveRequest, 
  getPendingLeaveRequests, 
  getStudentLeaveHistory, 
  cancelLeaveRequest, 
  getLeaveStats 
} from './handlers/leave_management';
import { 
  createSchedule, 
  updateSchedule, 
  getSchedulesByClass, 
  getSchedulesByTeacher, 
  getSchedules, 
  getTodaySchedule, 
  deleteSchedule, 
  checkScheduleConflicts, 
  bulkCreateSchedules 
} from './handlers/schedule_management';
import { 
  getAdminDashboardStats, 
  getTeacherDashboardData, 
  getStudentDashboardData, 
  getAttendanceTrends, 
  getClassPerformanceComparison, 
  getRecentActivities 
} from './handlers/dashboard';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'Sekolah Absenku API',
      timezone: 'Asia/Jakarta'
    };
  }),

  // Authentication routes
  auth: router({
    login: publicProcedure
      .input(loginInputSchema)
      .mutation(({ input }) => login(input)),
    
    verifyToken: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(({ input }) => verifyToken(input.token)),
  }),

  // User management routes (Admin only)
  users: router({
    create: publicProcedure
      .input(createUserInputSchema)
      .mutation(({ input }) => createUser(input)),
    
    update: publicProcedure
      .input(updateUserInputSchema)
      .mutation(({ input }) => updateUser(input)),
    
    getAll: publicProcedure
      .query(() => getUsers()),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getUserById(input.id)),
    
    changePassword: publicProcedure
      .input(changePasswordInputSchema)
      .mutation(({ input }) => changePassword(input)),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteUser(input.id)),
  }),

  // Class management routes
  classes: router({
    create: publicProcedure
      .input(createClassInputSchema)
      .mutation(({ input }) => createClass(input)),
    
    update: publicProcedure
      .input(updateClassInputSchema)
      .mutation(({ input }) => updateClass(input)),
    
    getAll: publicProcedure
      .query(() => getClasses()),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getClassById(input.id)),
    
    getByYear: publicProcedure
      .input(z.object({ academicYear: z.string() }))
      .query(({ input }) => getClassesByYear(input.academicYear)),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteClass(input.id)),
  }),

  // Teacher management routes
  teachers: router({
    create: publicProcedure
      .input(createTeacherInputSchema)
      .mutation(({ input }) => createTeacher(input)),
    
    update: publicProcedure
      .input(updateTeacherInputSchema)
      .mutation(({ input }) => updateTeacher(input)),
    
    getAll: publicProcedure
      .query(() => getTeachers()),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getTeacherById(input.id)),
    
    getByNip: publicProcedure
      .input(z.object({ nip: z.string() }))
      .query(({ input }) => getTeacherByNip(input.nip)),
    
    assignToClass: publicProcedure
      .input(assignTeacherToClassInputSchema)
      .mutation(({ input }) => assignTeacherToClass(input)),
    
    getClasses: publicProcedure
      .input(getTeacherClassesInputSchema)
      .query(({ input }) => getTeacherClasses(input)),
    
    removeFromClass: publicProcedure
      .input(z.object({ teacherClassId: z.number() }))
      .mutation(({ input }) => removeTeacherFromClass(input.teacherClassId)),
    
    updateProfile: publicProcedure
      .input(updateTeacherProfileInputSchema)
      .mutation(({ input }) => updateTeacherProfile(input)),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteTeacher(input.id)),
  }),

  // Student management routes
  students: router({
    create: publicProcedure
      .input(createStudentInputSchema)
      .mutation(({ input }) => createStudent(input)),
    
    update: publicProcedure
      .input(updateStudentInputSchema)
      .mutation(({ input }) => updateStudent(input)),
    
    getAll: publicProcedure
      .query(() => getStudents()),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getStudentById(input.id)),
    
    getByNisn: publicProcedure
      .input(z.object({ nisn: z.string() }))
      .query(({ input }) => getStudentByNisn(input.nisn)),
    
    getByClass: publicProcedure
      .input(getStudentsByClassInputSchema)
      .query(({ input }) => getStudentsByClass(input)),
    
    updateProfile: publicProcedure
      .input(updateStudentProfileInputSchema)
      .mutation(({ input }) => updateStudentProfile(input)),
    
    transfer: publicProcedure
      .input(z.object({ studentId: z.number(), newClassId: z.number() }))
      .mutation(({ input }) => transferStudent(input.studentId, input.newClassId)),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteStudent(input.id)),
  }),

  // Attendance management routes
  attendance: router({
    checkIn: publicProcedure
      .input(checkInInputSchema)
      .mutation(({ input }) => checkIn(input)),
    
    checkOut: publicProcedure
      .input(checkOutInputSchema)
      .mutation(({ input }) => checkOut(input)),
    
    mark: publicProcedure
      .input(markAttendanceInputSchema.extend({ createdBy: z.number() }))
      .mutation(({ input }) => markAttendance(input, input.createdBy)),
    
    get: publicProcedure
      .input(getAttendanceInputSchema)
      .query(({ input }) => getAttendance(input)),
    
    getTodayByClass: publicProcedure
      .input(z.object({ classId: z.number() }))
      .query(({ input }) => getTodayAttendanceByClass(input.classId)),
    
    getStudentHistory: publicProcedure
      .input(z.object({ 
        studentId: z.number(), 
        startDate: z.coerce.date().optional(), 
        endDate: z.coerce.date().optional() 
      }))
      .query(({ input }) => getStudentAttendanceHistory(input.studentId, input.startDate, input.endDate)),
    
    getStats: publicProcedure
      .input(z.object({ 
        classId: z.number().optional(), 
        startDate: z.coerce.date().optional(), 
        endDate: z.coerce.date().optional() 
      }))
      .query(({ input }) => getAttendanceStats(input.classId, input.startDate, input.endDate)),
    
    generateReport: publicProcedure
      .input(getAttendanceReportInputSchema)
      .query(({ input }) => generateAttendanceReport(input)),
    
    bulkMark: publicProcedure
      .input(z.object({ 
        classId: z.number(), 
        date: z.coerce.date(), 
        attendanceData: z.array(z.object({
          student_id: z.number(),
          status: z.string(),
          notes: z.string().optional()
        })),
        createdBy: z.number()
      }))
      .mutation(({ input }) => bulkMarkAttendance(input.classId, input.date, input.attendanceData, input.createdBy)),
  }),

  // Leave request management routes
  leaveRequests: router({
    create: publicProcedure
      .input(createLeaveRequestInputSchema)
      .mutation(({ input }) => createLeaveRequest(input)),
    
    getAll: publicProcedure
      .input(z.object({ 
        studentId: z.number().optional(), 
        status: z.string().optional() 
      }))
      .query(({ input }) => getLeaveRequests(input.studentId, input.status)),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getLeaveRequestById(input.id)),
    
    approve: publicProcedure
      .input(approveLeaveRequestInputSchema.extend({ approvedBy: z.number() }))
      .mutation(({ input }) => approveLeaveRequest(input, input.approvedBy)),
    
    getPending: publicProcedure
      .input(z.object({ teacherId: z.number().optional() }))
      .query(({ input }) => getPendingLeaveRequests(input.teacherId)),
    
    getStudentHistory: publicProcedure
      .input(z.object({ studentId: z.number() }))
      .query(({ input }) => getStudentLeaveHistory(input.studentId)),
    
    cancel: publicProcedure
      .input(z.object({ id: z.number(), studentId: z.number() }))
      .mutation(({ input }) => cancelLeaveRequest(input.id, input.studentId)),
    
    getStats: publicProcedure
      .input(z.object({ 
        classId: z.number().optional(), 
        startDate: z.coerce.date().optional(), 
        endDate: z.coerce.date().optional() 
      }))
      .query(({ input }) => getLeaveStats(input.classId, input.startDate, input.endDate)),
  }),

  // Schedule management routes
  schedules: router({
    create: publicProcedure
      .input(createScheduleInputSchema)
      .mutation(({ input }) => createSchedule(input)),
    
    update: publicProcedure
      .input(updateScheduleInputSchema)
      .mutation(({ input }) => updateSchedule(input)),
    
    getAll: publicProcedure
      .input(z.object({ academicYear: z.string().optional() }))
      .query(({ input }) => getSchedules(input.academicYear)),
    
    getByClass: publicProcedure
      .input(z.object({ classId: z.number(), academicYear: z.string().optional() }))
      .query(({ input }) => getSchedulesByClass(input.classId, input.academicYear)),
    
    getByTeacher: publicProcedure
      .input(z.object({ teacherId: z.number(), academicYear: z.string().optional() }))
      .query(({ input }) => getSchedulesByTeacher(input.teacherId, input.academicYear)),
    
    getTodayByClass: publicProcedure
      .input(z.object({ classId: z.number() }))
      .query(({ input }) => getTodaySchedule(input.classId)),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteSchedule(input.id)),
    
    checkConflicts: publicProcedure
      .input(z.object({ 
        classId: z.number(), 
        teacherId: z.number().nullable(), 
        dayOfWeek: dayOfWeekSchema, 
        startTime: z.string(), 
        endTime: z.string(),
        excludeId: z.number().optional()
      }))
      .query(({ input }) => checkScheduleConflicts(
        input.classId, 
        input.teacherId, 
        input.dayOfWeek, 
        input.startTime, 
        input.endTime, 
        input.excludeId
      )),
    
    bulkCreate: publicProcedure
      .input(z.object({ schedules: z.array(createScheduleInputSchema) }))
      .mutation(({ input }) => bulkCreateSchedules(input.schedules)),
  }),

  // Dashboard routes
  dashboard: router({
    admin: publicProcedure
      .query(() => getAdminDashboardStats()),
    
    teacher: publicProcedure
      .input(z.object({ teacherId: z.number() }))
      .query(({ input }) => getTeacherDashboardData(input.teacherId)),
    
    student: publicProcedure
      .input(z.object({ studentId: z.number() }))
      .query(({ input }) => getStudentDashboardData(input.studentId)),
    
    attendanceTrends: publicProcedure
      .input(z.object({ 
        classId: z.number().optional(), 
        period: z.enum(['week', 'month']).optional() 
      }))
      .query(({ input }) => getAttendanceTrends(input.classId, input.period)),
    
    classComparison: publicProcedure
      .query(() => getClassPerformanceComparison()),
    
    recentActivities: publicProcedure
      .input(z.object({ userId: z.number(), userRole: z.string() }))
      .query(({ input }) => getRecentActivities(input.userId, input.userRole)),
  }),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors({
        origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
        credentials: true,
      })(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });

  server.listen(port);
  console.log(`🚀 Sekolah Absenku tRPC Server listening at port: ${port}`);
  console.log(`📍 Timezone: Asia/Jakarta`);
  console.log(`🎯 Environment: ${process.env['NODE_ENV'] || 'development'}`);
}

start().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});