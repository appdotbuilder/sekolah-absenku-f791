import { 
  serial, 
  text, 
  pgTable, 
  timestamp, 
  boolean, 
  integer,
  pgEnum,
  time,
  date,
  unique
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'guru', 'siswa']);
export const attendanceStatusEnum = pgEnum('attendance_status', ['hadir', 'tidak_hadir', 'izin', 'sakit', 'alpa']);
export const leaveRequestStatusEnum = pgEnum('leave_request_status', ['pending', 'approved', 'rejected']);
export const leaveRequestTypeEnum = pgEnum('leave_request_type', ['izin', 'sakit']);
export const dayOfWeekEnum = pgEnum('day_of_week', ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']);

// Users table - base authentication table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Classes table
export const classesTable = pgTable('classes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // e.g., "XII IPA 1"
  grade: text('grade').notNull(), // e.g., "XII", "XI", "X"
  academic_year: text('academic_year').notNull(), // e.g., "2024/2025"
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  uniqueClassPerYear: unique().on(table.name, table.academic_year)
}));

// Teachers table
export const teachersTable = pgTable('teachers', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  nip: text('nip').notNull().unique(), // Nomor Induk Pegawai
  full_name: text('full_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Students table
export const studentsTable = pgTable('students', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  nisn: text('nisn').notNull().unique(), // Nomor Induk Siswa Nasional
  full_name: text('full_name').notNull(),
  class_id: integer('class_id').notNull().references(() => classesTable.id),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  parent_name: text('parent_name'),
  parent_phone: text('parent_phone'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Teacher-Class assignments table (many-to-many)
export const teacherClassesTable = pgTable('teacher_classes', {
  id: serial('id').primaryKey(),
  teacher_id: integer('teacher_id').notNull().references(() => teachersTable.id, { onDelete: 'cascade' }),
  class_id: integer('class_id').notNull().references(() => classesTable.id, { onDelete: 'cascade' }),
  is_homeroom: boolean('is_homeroom').notNull().default(false), // Wali kelas
  academic_year: text('academic_year').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
  uniqueTeacherClassYear: unique().on(table.teacher_id, table.class_id, table.academic_year)
}));

// Schedules table
export const schedulesTable = pgTable('schedules', {
  id: serial('id').primaryKey(),
  class_id: integer('class_id').notNull().references(() => classesTable.id, { onDelete: 'cascade' }),
  day_of_week: dayOfWeekEnum('day_of_week').notNull(),
  start_time: time('start_time').notNull(), // HH:mm format
  end_time: time('end_time').notNull(), // HH:mm format
  subject: text('subject').notNull(),
  teacher_id: integer('teacher_id').references(() => teachersTable.id),
  academic_year: text('academic_year').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Attendance table
export const attendanceTable = pgTable('attendance', {
  id: serial('id').primaryKey(),
  student_id: integer('student_id').notNull().references(() => studentsTable.id, { onDelete: 'cascade' }),
  class_id: integer('class_id').notNull().references(() => classesTable.id),
  date: date('date').notNull(),
  status: attendanceStatusEnum('status').notNull().default('tidak_hadir'),
  check_in_time: timestamp('check_in_time'),
  check_out_time: timestamp('check_out_time'),
  notes: text('notes'),
  created_by: integer('created_by').notNull().references(() => usersTable.id), // Who recorded this attendance
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  uniqueStudentDate: unique().on(table.student_id, table.date)
}));

// Leave requests table
export const leaveRequestsTable = pgTable('leave_requests', {
  id: serial('id').primaryKey(),
  student_id: integer('student_id').notNull().references(() => studentsTable.id, { onDelete: 'cascade' }),
  type: leaveRequestTypeEnum('type').notNull(),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  reason: text('reason').notNull(),
  attachment_url: text('attachment_url'), // URL to uploaded document/image
  status: leaveRequestStatusEnum('status').notNull().default('pending'),
  approved_by: integer('approved_by').references(() => usersTable.id), // Who approved/rejected
  approved_at: timestamp('approved_at'),
  approval_notes: text('approval_notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(usersTable, ({ one }) => ({
  teacher: one(teachersTable, {
    fields: [usersTable.id],
    references: [teachersTable.user_id]
  }),
  student: one(studentsTable, {
    fields: [usersTable.id],
    references: [studentsTable.user_id]
  })
}));

export const teachersRelations = relations(teachersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [teachersTable.user_id],
    references: [usersTable.id]
  }),
  teacherClasses: many(teacherClassesTable),
  schedules: many(schedulesTable)
}));

export const studentsRelations = relations(studentsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [studentsTable.user_id],
    references: [usersTable.id]
  }),
  class: one(classesTable, {
    fields: [studentsTable.class_id],
    references: [classesTable.id]
  }),
  attendance: many(attendanceTable),
  leaveRequests: many(leaveRequestsTable)
}));

export const classesRelations = relations(classesTable, ({ many }) => ({
  students: many(studentsTable),
  teacherClasses: many(teacherClassesTable),
  schedules: many(schedulesTable),
  attendance: many(attendanceTable)
}));

export const teacherClassesRelations = relations(teacherClassesTable, ({ one }) => ({
  teacher: one(teachersTable, {
    fields: [teacherClassesTable.teacher_id],
    references: [teachersTable.id]
  }),
  class: one(classesTable, {
    fields: [teacherClassesTable.class_id],
    references: [classesTable.id]
  })
}));

export const schedulesRelations = relations(schedulesTable, ({ one }) => ({
  class: one(classesTable, {
    fields: [schedulesTable.class_id],
    references: [classesTable.id]
  }),
  teacher: one(teachersTable, {
    fields: [schedulesTable.teacher_id],
    references: [teachersTable.id]
  })
}));

export const attendanceRelations = relations(attendanceTable, ({ one }) => ({
  student: one(studentsTable, {
    fields: [attendanceTable.student_id],
    references: [studentsTable.id]
  }),
  class: one(classesTable, {
    fields: [attendanceTable.class_id],
    references: [classesTable.id]
  }),
  createdBy: one(usersTable, {
    fields: [attendanceTable.created_by],
    references: [usersTable.id]
  })
}));

export const leaveRequestsRelations = relations(leaveRequestsTable, ({ one }) => ({
  student: one(studentsTable, {
    fields: [leaveRequestsTable.student_id],
    references: [studentsTable.id]
  }),
  approvedBy: one(usersTable, {
    fields: [leaveRequestsTable.approved_by],
    references: [usersTable.id]
  })
}));

// Export all tables for query building
export const tables = {
  users: usersTable,
  classes: classesTable,
  teachers: teachersTable,
  students: studentsTable,
  teacherClasses: teacherClassesTable,
  schedules: schedulesTable,
  attendance: attendanceTable,
  leaveRequests: leaveRequestsTable
};

// TypeScript types for the tables
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Class = typeof classesTable.$inferSelect;
export type NewClass = typeof classesTable.$inferInsert;

export type Teacher = typeof teachersTable.$inferSelect;
export type NewTeacher = typeof teachersTable.$inferInsert;

export type Student = typeof studentsTable.$inferSelect;
export type NewStudent = typeof studentsTable.$inferInsert;

export type TeacherClass = typeof teacherClassesTable.$inferSelect;
export type NewTeacherClass = typeof teacherClassesTable.$inferInsert;

export type Schedule = typeof schedulesTable.$inferSelect;
export type NewSchedule = typeof schedulesTable.$inferInsert;

export type Attendance = typeof attendanceTable.$inferSelect;
export type NewAttendance = typeof attendanceTable.$inferInsert;

export type LeaveRequest = typeof leaveRequestsTable.$inferSelect;
export type NewLeaveRequest = typeof leaveRequestsTable.$inferInsert;