import {
  boolean,
  date,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_sessions_user").on(table.userId), index("idx_sessions_token").on(table.token)],
);

export const otpCodes = pgTable("otp_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  phone: text("phone").notNull(),
  codeHash: text("code_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  consumed: boolean("consumed").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name").notNull().default(""),
  gender: text("gender"),
  dateOfBirth: date("date_of_birth"),
  nationality: text("nationality").default("DE"),
  maritalStatus: text("marital_status"),
  phone: text("phone"),
  street: text("street"),
  houseNumber: text("house_number"),
  postalCode: text("postal_code"),
  city: text("city"),
  country: text("country").default("DE"),
  employmentStatus: text("employment_status"),
  employerName: text("employer_name"),
  jobTitle: text("job_title"),
  monthlyNetIncome: numeric("monthly_net_income", { precision: 10, scale: 2 }),
  employmentSince: date("employment_since"),
  iban: text("iban"),
  bic: text("bic"),
  accountHolder: text("account_holder"),
  avatarUrl: text("avatar_url"),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const loanProducts = pgTable("loan_products", {
  id: text("id").primaryKey(),
  nameDe: text("name_de").notNull(),
  descriptionDe: text("description_de").notNull(),
  minAmount: numeric("min_amount", { precision: 12, scale: 2 }).notNull(),
  maxAmount: numeric("max_amount", { precision: 12, scale: 2 }).notNull(),
  minDurationMonths: integer("min_duration_months").notNull().default(3),
  maxDurationMonths: integer("max_duration_months").notNull().default(360),
  exampleAnnualRate: numeric("example_annual_rate", { precision: 5, scale: 3 }).notNull().default("2.200"),
  insuranceRateMonthly: numeric("insurance_rate_monthly", { precision: 6, scale: 4 }).notNull().default("0.0000"),
  iconName: text("icon_name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").default(true).notNull(),
});

export const loanApplications = pgTable(
  "loan_applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    applicationNumber: text("application_number").notNull().unique(),
    loanType: text("loan_type").notNull(),
    requestedAmount: numeric("requested_amount", { precision: 12, scale: 2 }).notNull(),
    durationMonths: integer("duration_months").notNull(),
    exampleAnnualRate: numeric("example_annual_rate", { precision: 5, scale: 3 }).notNull().default("2.200"),
    exampleMonthlyPayment: numeric("example_monthly_payment", { precision: 10, scale: 2 }),
    exampleTotalRepayment: numeric("example_total_repayment", { precision: 14, scale: 2 }),
    exampleTotalInterest: numeric("example_total_interest", { precision: 12, scale: 2 }),
    purpose: text("purpose"),
    status: text("status").notNull().default("entwurf"),
    partnerName: text("partner_name"),
    partnerReference: text("partner_reference"),
    partnerOfferRate: numeric("partner_offer_rate", { precision: 5, scale: 3 }),
    partnerOfferMonthly: numeric("partner_offer_monthly", { precision: 10, scale: 2 }),
    notes: text("notes"),
    personalSnapshot: text("personal_snapshot"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_applications_user").on(table.userId),
    index("idx_applications_status").on(table.status),
  ],
);

export const existingCredits = pgTable(
  "existing_credits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => loanApplications.id, { onDelete: "cascade" }),
    creditorName: text("creditor_name").notNull(),
    remainingDebt: numeric("remaining_debt", { precision: 12, scale: 2 }).notNull(),
    monthlyPayment: numeric("monthly_payment", { precision: 10, scale: 2 }).notNull(),
    annualInterestRate: numeric("annual_interest_rate", { precision: 5, scale: 3 }).notNull(),
    remainingMonths: integer("remaining_months").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_existing_credits_app").on(table.applicationId)],
);

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    applicationId: uuid("application_id").references(() => loanApplications.id, { onDelete: "set null" }),
    documentType: text("document_type").notNull(),
    fileName: text("file_name").notNull(),
    fileSizeBytes: integer("file_size_bytes"),
    mimeType: text("mime_type").notNull(),
    fileData: text("file_data"),
    verified: boolean("verified").default(false).notNull(),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_documents_user").on(table.userId),
    index("idx_documents_app").on(table.applicationId),
  ],
);

export const amortizationSchedules = pgTable(
  "amortization_schedules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => loanApplications.id, { onDelete: "cascade" }),
    monthNumber: integer("month_number").notNull(),
    paymentDate: date("payment_date").notNull(),
    principalPart: numeric("principal_part", { precision: 10, scale: 2 }).notNull(),
    interestPart: numeric("interest_part", { precision: 10, scale: 2 }).notNull(),
    totalPayment: numeric("total_payment", { precision: 10, scale: 2 }).notNull(),
    remainingBalance: numeric("remaining_balance", { precision: 12, scale: 2 }).notNull(),
  },
  (table) => [
    index("idx_amortization_app").on(table.applicationId),
    uniqueIndex("idx_amortization_unique").on(table.applicationId, table.monthNumber),
  ],
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    message: text("message").notNull(),
    type: text("type").default("info").notNull(),
    link: text("link"),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_notifications_user").on(table.userId)],
);

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.id] }),
  sessions: many(sessions),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, { fields: [profiles.id], references: [users.id] }),
  applications: many(loanApplications),
  documents: many(documents),
  notifications: many(notifications),
}));

export const loanApplicationsRelations = relations(loanApplications, ({ one, many }) => ({
  profile: one(profiles, { fields: [loanApplications.userId], references: [profiles.id] }),
  existingCredits: many(existingCredits),
  documents: many(documents),
  schedule: many(amortizationSchedules),
}));

export const existingCreditsRelations = relations(existingCredits, ({ one }) => ({
  application: one(loanApplications, {
    fields: [existingCredits.applicationId],
    references: [loanApplications.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  profile: one(profiles, { fields: [documents.userId], references: [profiles.id] }),
  application: one(loanApplications, {
    fields: [documents.applicationId],
    references: [loanApplications.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  profile: one(profiles, { fields: [notifications.userId], references: [profiles.id] }),
}));

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type LoanApplication = typeof loanApplications.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type DocumentRow = typeof documents.$inferSelect;
