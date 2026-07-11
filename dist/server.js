

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";

// src/utility/sendResponse.ts
import httpCode from "http-status";
var rootResponse = (res) => {
  res.status(httpCode.OK).json({
    success: true,
    status: httpCode.OK,
    author: "Md. Shahdat Hossain",
    message: "Welcome to the FixItNow to your trusted home service platform",
    description: "FixItNow is a backend API for a home services marketplace. Customers can browse available services (plumbing, electrical, cleaning, painting, etc.), book qualified technicians, and leave reviews. Technicians can create service profiles, manage their availability, and handle job bookings. Admins oversee the platform, manage users, and moderate service categories."
  });
};
var successResponse = (res, statusCode, message, data, meta) => {
  const response = {
    success: true,
    statusCode,
    message: message || "Request completed successfully",
    data,
    meta
  };
  res.status(httpCode.OK).json(response);
};
var notFoundResponse = (res, message) => {
  const response = {
    success: false,
    statusCode: httpCode.NOT_FOUND,
    message: message || "Not Found!!",
    data: null
  };
  res.status(httpCode.NOT_FOUND).json(response);
};
var unauthorizedResponse = (res, message) => {
  const response = {
    success: false,
    statusCode: httpCode.UNAUTHORIZED,
    message: message || "Unauthorized access!"
  };
  res.status(httpCode.UNAUTHORIZED).json(response);
};
var forbiddenResponse = (res, message) => {
  const response = {
    success: false,
    statusCode: httpCode.FORBIDDEN,
    message
  };
  res.status(httpCode.FORBIDDEN).json(response);
};
var badResponse = (res, message) => {
  const response = {
    success: false,
    statusCode: httpCode.BAD_REQUEST,
    message
  };
  res.status(httpCode.BAD_REQUEST).json(response);
};
var errorResponse = (res, message, data) => {
  const response = {
    success: false,
    statusCode: httpCode.INTERNAL_SERVER_ERROR,
    message: message || "Internal server error!",
    data
  };
  res.status(httpCode.INTERNAL_SERVER_ERROR).json(response);
};

// src/app.ts
import cookieParser from "cookie-parser";

// src/modules/auth/auth.route.ts
import { Router } from "express";

// src/utility/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
var catchAsync_default = catchAsync;

// src/config/env.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var config = {
  port: process.env.PORT,
  solt_or_rounds: process.env.SOLT_OR_ROUNDS,
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_sectet: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  stripe_sercet_key: process.env.STRIPE_SECRET_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET
};
var env_default = config;

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config2 = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Booking {\n  id String @id @default(uuid())\n\n  customerId   String\n  customer     User              @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  technicianId String\n  technician   TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Cascade)\n  serviceId    String\n  service      Services          @relation(fields: [serviceId], references: [id], onDelete: Cascade)\n\n  scheduledDate DateTime\n  address       String\n  note          String?\n  totalAmount   Decimal       @db.Decimal(10, 2)\n  status        BookingStatus @default(REQUESTED)\n\n  cancelReason String?\n  acceptedAt   DateTime?\n  canceledAt   DateTime?\n  completedAt  DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  payment Payment?\n\n  @@index([customerId])\n  @@index([technicianId])\n  @@index([serviceId])\n  @@map("bookings")\n}\n\nmodel Category {\n  id String @id @default(uuid())\n\n  name        String  @unique\n  icon        String?\n  description String\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  services Services[]\n\n  @@map("categories")\n}\n\nenum Role {\n  CUSTOMER\n  TECHNICIAN\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n}\n\nenum BookingStatus {\n  REQUESTED\n  ACCEPTED\n  DECLINED\n  IN_PROGRESS\n  COMPLETED\n  CANCELLED\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  REFUNDED\n}\n\nmodel Payment {\n  id String @id @default(uuid())\n\n  bookingId String  @unique\n  booking   Booking @relation(fields: [bookingId], references: [id])\n  userId    String\n  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  transactionId   String        @unique\n  paymentIntentId String        @unique\n  amount          Decimal       @db.Decimal(10, 2)\n  status          PaymentStatus\n  paidAt          DateTime\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([bookingId])\n  @@index([userId])\n  @@map("payments")\n}\n\nmodel Review {\n  id String @id @default(uuid())\n\n  serviceId    String\n  service      Services          @relation(fields: [serviceId], references: [id], onDelete: Cascade)\n  customerId   String\n  customer     User              @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  technicianId String\n  technician   TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Cascade)\n\n  rating  Decimal @db.Decimal(2, 1)\n  comment String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([customerId])\n  @@index([technicianId])\n  @@index([serviceId])\n  @@map("reviews")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Services {\n  id String @id @default(uuid())\n\n  technicianProfileId String\n  technician          TechnicianProfile @relation(fields: [technicianProfileId], references: [id], onDelete: Cascade)\n  categoryId          String\n  category            Category          @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  title       String\n  description String\n  price       Decimal  @db.Decimal(10, 2)\n  type        String\n  duration    String\n  location    String[]\n  availableAt String[]\n  isActive    Boolean  @default(true)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  review   Review[]\n  bookings Booking[]\n\n  @@index([technicianProfileId])\n  @@index([categoryId])\n  @@map("services")\n}\n\nmodel TechnicianProfile {\n  id String @id @default(uuid())\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  bio           String?\n  skills        String[]\n  experience    Int?\n  hourlyRate    Decimal  @default(0) @db.Decimal(10, 2)\n  completedJobs Int      @default(0)\n  availability  String[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  services Services[]\n  bookings Booking[]\n  reviews  Review[]\n\n  @@index([userId])\n  @@map("technician_profiles")\n}\n\nmodel User {\n  id String @id @default(uuid())\n\n  firstName    String\n  lastName     String?\n  email        String  @unique\n  password     String\n  phone        String  @unique\n  profileImage String?\n  address      String?\n  city         String?\n\n  role   Role\n  status UserStatus @default(ACTIVE)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  technicianProfile TechnicianProfile?\n  customerBookings  Booking[]\n  reviews           Review[]\n  payments          Payment[]\n\n  @@map("users")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config2.runtimeDataModel = JSON.parse('{"models":{"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"BookingToUser"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"BookingToTechnicianProfile"},{"name":"serviceId","kind":"scalar","type":"String"},{"name":"service","kind":"object","type":"Services","relationName":"BookingToServices"},{"name":"scheduledDate","kind":"scalar","type":"DateTime"},{"name":"address","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"cancelReason","kind":"scalar","type":"String"},{"name":"acceptedAt","kind":"scalar","type":"DateTime"},{"name":"canceledAt","kind":"scalar","type":"DateTime"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payment","kind":"object","type":"Payment","relationName":"BookingToPayment"}],"dbName":"bookings"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"services","kind":"object","type":"Services","relationName":"CategoryToServices"}],"dbName":"categories"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToPayment"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"paymentIntentId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"serviceId","kind":"scalar","type":"String"},{"name":"service","kind":"object","type":"Services","relationName":"ReviewToServices"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"ReviewToTechnicianProfile"},{"name":"rating","kind":"scalar","type":"Decimal"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"Services":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"technicianProfileId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"ServicesToTechnicianProfile"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToServices"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"type","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"availableAt","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"review","kind":"object","type":"Review","relationName":"ReviewToServices"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToServices"}],"dbName":"services"},"TechnicianProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TechnicianProfileToUser"},{"name":"bio","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"hourlyRate","kind":"scalar","type":"Decimal"},{"name":"completedJobs","kind":"scalar","type":"Int"},{"name":"availability","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"services","kind":"object","type":"Services","relationName":"ServicesToTechnicianProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTechnicianProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTechnicianProfile"}],"dbName":"technician_profiles"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"firstName","kind":"scalar","type":"String"},{"name":"lastName","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"profileImage","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"technicianProfile","kind":"object","type":"TechnicianProfile","relationName":"TechnicianProfileToUser"},{"name":"customerBookings","kind":"object","type":"Booking","relationName":"BookingToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"}],"dbName":"users"}},"enums":{},"types":{}}');
config2.parameterizationSchema = {
  strings: JSON.parse('["where","user","orderBy","cursor","technician","services","_count","category","service","customer","review","bookings","reviews","technicianProfile","customerBookings","booking","payments","payment","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","data","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","create","update","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","having","_avg","_sum","_min","_max","Booking.groupBy","Booking.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Services.findUnique","Services.findUniqueOrThrow","Services.findFirst","Services.findFirstOrThrow","Services.findMany","Services.createOne","Services.createMany","Services.createManyAndReturn","Services.updateOne","Services.updateMany","Services.updateManyAndReturn","Services.upsertOne","Services.deleteOne","Services.deleteMany","Services.groupBy","Services.aggregate","TechnicianProfile.findUnique","TechnicianProfile.findUniqueOrThrow","TechnicianProfile.findFirst","TechnicianProfile.findFirstOrThrow","TechnicianProfile.findMany","TechnicianProfile.createOne","TechnicianProfile.createMany","TechnicianProfile.createManyAndReturn","TechnicianProfile.updateOne","TechnicianProfile.updateMany","TechnicianProfile.updateManyAndReturn","TechnicianProfile.upsertOne","TechnicianProfile.deleteOne","TechnicianProfile.deleteMany","TechnicianProfile.groupBy","TechnicianProfile.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","firstName","lastName","email","password","phone","profileImage","address","city","Role","role","UserStatus","status","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","userId","bio","skills","experience","hourlyRate","completedJobs","availability","has","hasEvery","hasSome","technicianProfileId","categoryId","title","description","price","type","duration","location","availableAt","isActive","serviceId","customerId","technicianId","rating","comment","bookingId","transactionId","paymentIntentId","amount","PaymentStatus","paidAt","name","icon","scheduledDate","note","totalAmount","BookingStatus","cancelReason","acceptedAt","canceledAt","completedAt","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "oARHcBYEAACJAgAgCAAAigIAIAkAAO8BACARAACLAgAgigEAAIYCADCLAQAADwAQjAEAAIYCADCNAQEAAAABlAEBANcBACGZAQAAhwLPASKaAUAA2wEAIZsBQADbAQAhvgEBANcBACG_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-AQAh0QFAAP4BACHSAUAA_gEAIQMAAAAPACACAAA0ADAjAAA1ACADAAAADwAgAgAAEAAwAwAAAQAgCgUAAPABACCKAQAA-wEAMIsBAAA7ABCMAQAA-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_AQEAAAABwAEBAAAAAcEBEAAAAAHCAQEAAAABARcAAG4AMAEXAABuADALBAAAuQIAIAgAALgCACAJAADsAgAgjQEBAJQCACGaAUAAmAIAIZsBQACYAgAhvgEBAJQCACG_AQEAlAIAIcABAQCUAgAhwQEQAKcCACHCAQEAlQIAIQIAAAANACAXAABxACAIjQEBAJQCACGaAUAAmAIAIZsBQACYAgAhvgEBAJQCACG_AQEAlAIAIcABAQCUAgAhwQEQAKcCACHCAQEAlQIAIQIAAAALACAXAABzACACAAAACwAgFwAAcwAgAwAAAA0AIB4AAGwAIB8AAHEAIAEAAAANACABAAAACwAgBgYAAMADACAkAADBAwAgJQAAxAMAICYAAMMDACAnAADCAwAgwgEAAJACACALigEAAPUBADCLAQAAegAQjAEAAPUBADCNAQEAxQEAIZoBQADJAQAhmwFAAMkBACG-AQEAxQEAIb8BAQDFAQAhwAEBAMUBACHBARAA4wEAIcIBAQDGAQAhAwAAAAsAIAIAAHkAMCMAAHoAIAMAAAALACACAAAMADADAAANACABAAAABwAgAQAAAAcAIAMAAAAFACACAAAGADADAAAHACADAAAABQAgAgAABgAwAwAABwAgAwAAAAUAIAIAAAYAMAMAAAcAIBEEAAC_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_AQEAxQEAIcABAQDFAQAhwQEQAOMBACHCAQEAxgEAIQ2KAQAA9gEAMIsBAABkABCMAQAA9gEAMI0BAQDFAQAhmQEAAPcByAEimgFAAMkBACGbAUAAyQEAIaoBAQDFAQAhwwEBAMUBACHEAQEAxQEAIcUBAQDFAQAhxgEQAOMBACHIAUAAyQEAIQcGAADLAQAgJgAA-QEAICcAAPkBACCcAQAAAMgBAp0BAAAAyAEIngEAAADIAQijAQAA-AHIASIHBgAAywEAICYAAPkBACAnAAD5AQAgnAEAAADIAQKdAQAAAMgBCJ4BAAAAyAEIowEAAPgByAEiBJwBAAAAyAECnQEAAADIAQieAQAAAMgBCKMBAAD5AcgBIgmKAQAA-gEAMIsBAABOABCMAQAA-gEAMI0BAQDFAQAhmgFAAMkBACGbAUAAyQEAIbcBAQDFAQAhyQEBAMUBACHKAQEAxgEAIQoFAADwAQAgigEAAPsBADCLAQAAOwAQjAEAAPsBADCNAQEA1wEAIZoBQADbAQAhmwFAANsBACG3AQEA1wEAIckBAQDXAQAhygEBANgBACESigEAAPwBADCLAQAANQAQjAEAAPwBADCNAQEAxQEAIZQBAQDFAQAhmQEAAP0BzwEimgFAAMkBACGbAUAAyQEAIb4BAQDFAQAhvwEBAMUBACHAAQEAxQEAIcsBQADJAQAhzAEBAMYBACHNARAA4wEAIc8BAQDGAQAh0AFAAP4BACHRAUAA_gEAIdIBQAD-AQAhBwYAAMsBACAmAACCAgAgJwAAggIAIJwBAAAAzwECnQEAAADPAQieAQAAAM8BCKMBAACBAs8BIgsGAADSAQAgJgAAgAIAICcAAIACACCcAUAAAAABnQFAAAAABZ4BQAAAAAWfAUAAAAABoAFAAAAAAaEBQAAAAAGiAUAAAAABowFAAP8BACELBgAA0gEAICYAAIACACAnAACAAgAgnAFAAAAAAZ0BQAAAAAWeAUAAAAAFnwFAAAAAAaABQAAAAAGhAUAAAAABogFAAAAAAaMBQAD_AQAhCJwBQAAAAAGdAUAAAAAFngFAAAAABZ8BQAAAAAGgAUAAAAABoQFAAAAAAaIBQAAAAAGjAUAAgAIAIQcGAADLAQAgJgAAggIAICcAAIICACCcAQAAAM8BAp0BAAAAzwEIngEAAADPAQijAQAAgQLPASIEnAEAAADPAQKdAQAAAM8BCJ4BAAAAzwEIowEAAIICzwEiDwEAAO8BACAPAACFAgAgigEAAIMCADCLAQAAGwAQjAEAAIMCADCNAQEA1wEAIZkBAACEAsgBIpoBQADbAQAhmwFAANsBACGqAQEA1wEAIcMBAQDXAQAhxAEBANcBACHFAQEA1wEAIcYBEADtAQAhyAFAANsBACEEnAEAAADIAQKdAQAAAMgBCJ4BAAAAyAEIowEAAPkByAEiGAQAAIkCACAIAACKAgAgCQAA7wEAIBEAAIsCACCKAQAAhgIAMIsBAAAPABCMAQAAhgIAMI0BAQDXAQAhlAEBANcBACGZAQAAhwLPASKaAUAA2wEAIZsBQADbAQAhvgEBANcBACG_AQEA1wEAIcABAQDXAQAhywFAANsBACHMAQEA2AEAIc0BEADtAQAhzwEBANgBACHQAUAAiAIAIdEBQACIAgAh0gFAAIgCACHTAQAADwAg1AEAAA8AIBYEAACJAgAgCAAAigIAIAkAAO8BACARAACLAgAgigEAAIYCADCLAQAADwAQjAEAAIYCADCNAQEA1wEAIZQBAQDXAQAhmQEAAIcCzwEimgFAANsBACGbAUAA2wEAIb4BAQDXAQAhvwEBANcBACHAAQEA1wEAIcsBQADbAQAhzAEBANgBACHNARAA7QEAIc8BAQDYAQAh0AFAAIgCACHRAUAAiAIAIdIBQACIAgAhBJwBAAAAzwECnQEAAADPAQieAQAAAM8BCKMBAACCAs8BIgicAUAAAAABnQFAAAAABZ4BQAAAAAWfAUAAAAABoAFAAAAAAaEBQAAAAAGiAUAAAAABowFAAIACACETAQAA7wEAIAUAAPABACALAADdAQAgDAAA3gEAIIoBAADrAQAwiwEAAAMAEIwBAADrAQAwjQEBANcBACGaAUAA2wEAIZsBQADbAQAhqgEBANcBACGrAQEA2AEAIawBAADhAQAgrQECAOwBACGuARAA7QEAIa8BAgDuAQAhsAEAAOEBACDTAQAAAwAg1AEAAAMAIBYEAACJAgAgBwAAjwIAIAoAAN4BACALAADdAQAgigEAAI0CADCLAQAABQAQjAEAAI0CADCNAQEA1wEAIZoBQADbAQAhmwFAANsBACG0AQEA1wEAIbUBAQDXAQAhtgEBANcBACG3AQEA1wEAIbgBEADtAQAhuQEBANcBACG6AQEA1wEAIbsBAADhAQAgvAEAAOEBACC9ASAAjgIAIdMBAAAFACDUAQAABQAgEQEAAO8BACAPAACFAgAgigEAAIMCADCLAQAAGwAQjAEAAIMCADCNAQEA1wEAIZkBAACEAsgBIpoBQADbAQAhmwFAANsBACGqAQEA1wEAIcMBAQDXAQAhxAEBANcBACHFAQEA1wEAIcYBEADtAQAhyAFAANsBACHTAQAAGwAg1AEAABsAIA4EAACJAgAgCAAAigIAIAkAAO8BACCKAQAAjAIAMIsBAAALABCMAQAAjAIAMI0BAQDXAQAhmgFAANsBACGbAUAA2wEAIb4BAQDXAQAhvwEBANcBACHAAQEA1wEAIcEBEADtAQAhwgEBANgBACEUBAAAiQIAIAcAAI8CACAKAADeAQAgCwAA3QEAIIoBAACNAgAwiwEAAAUAEIwBAACNAgAwjQEBANcBACGaAUAA2wEAIZsBQADbAQAhtAEBANcBACG1AQEA1wEAIbYBAQDXAQAhtwEBANcBACG4ARAA7QEAIbkBAQDXAQAhugEBANcBACG7AQAA4QEAILwBAADhAQAgvQEgAI4CACECnAEgAAAAAaMBIAD0AQAhDAUAAPABACCKAQAA-wEAMIsBAAA7ABCMAQAA-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_wIAMNUBAAD7AgAw1gEAAPwCADDXAQAA_QIAINgBAAD-AgAw2QEAAP4CADDaAQAA_gIAMNsBAAD-AgAw3AEAAIADADDdAQAAgQMAMAseAADvAgAwHwAA8wIAMNUBAADwAgAw1gEAAPECADDXAQAA8gIAINgBAADBAgAw2QEAAMECADDaAQAAwQIAMNsBAADBAgAw3AEAAPQCADDdAQAAxAIAMAseAADkAgAwHwAA6AIAMNUBAADlAgAw1gEAAOYCADDXAQAA5wIAINgBAACxAgAw2QEAALECADDaAQAAsQIAMNsBAACxAgAw3AEAAOkCADDdAQAAtAIAMAkIAAC7AgAgCQAA7gIAII0BAQAAAAGaAUAAAAABmwFAAAAAAb4BAQAAAAG_AQEAAAABwQEQAAAAAcIBAQAAAAECAAAADQAgHgAA7QIAIAMAAAANACAeAADtAgAgHwAA6wIAIAEXAAD_AwAwAgAAAA0AIBcAAOsCACACAAAAtQIAIBcAAOoCACAHjQEBAJQCACGaAUAAmAIAIZsBQACYAgAhvgEBAJQCACG_AQEAlAIAIcEBEACnAgAhwgEBAJUCACEJCAAAuAIAIAkAAOwCACCNAQEAlAIAIZoBQACYAgAhmwFAAJgCACG-AQEAlAIAIb8BAQCUAgAhwQEQAKcCACHCAQEAlQIAIQUeAAD6AwAgHwAA_QMAINUBAAD7AwAg1gEAAPwDACDbAQAAqwEAIAkIAAC7AgAgCQAA7gIAII0BAQAAAAGaAUAAAAABmwFAAAAAAb4BAQAAAAG_AQEAAAABwQEQAAAAAcIBAQAAAAEDHgAA-gMAINUBAAD7AwAg2wEAAKsBACARCAAA1gIAIAkAAPkCACARAADXAgAgjQEBAAAAAZQBAQAAAAGZAQAAAM8BApoBQAAAAAGbAUAAAAABvgEBAAAAAb8BAQAAAAHLAUAAAAABzAEBAAAAAc0BEAAAAAHPAQEAAAAB0AFAAAAAAdEBQAAAAAHSAUAAAAABAgAAAAEAIB4AAPgCACADAAAAAQAgHgAA-AIAIB8AAPYCACABFwAA-QMAMAIAAAABACAXAAD2AgAgAgAAAMUCACAXAAD1AgAgDo0BAQCUAgAhlAEBAJQCACGZAQAAxwLPASKaAUAAmAIAIZsBQACYAgAhvgEBAJQCACG_AQEAlAIAIcsBQACYAgAhzAEBAJUCACHNARAApwIAIc8BAQCVAgAh0AFAAMgCACHRAUAAyAIAIdIBQADIAgAhEQgAAMsCACAJAAD3AgAgEQAAzAIAII0BAQCUAgAhlAEBAJQCACGZAQAAxwLPASKaAUAAmAIAIZsBQACYAgAhvgEBAJQCACG_AQEAlAIAIcsBQACYAgAhzAEBAJUCACHNARAApwIAIc8BAQCVAgAh0AFAAMgCACHRAUAAyAIAIdIBQADIAgAhBR4AAPQDACAfAAD3AwAg1QEAAPUDACDWAQAA9gMAINsBAACrAQAgEQgAANYCACAJAAD5AgAgEQAA1wIAII0BAQAAAAGUAQEAAAABmQEAAADPAQKaAUAAAAABmwFAAAAAAb4BAQAAAAG_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_AQEAAAABwAEBAAAAAcsBQAAAAAHMAQEAAAABzQEQAAAAAc8BAQAAAAHQAUAAAAAB0QFAAAAAAdIBQAAAAAEJBAAAvAIAIAkAAO4CACCNAQEAAAABmgFAAAAAAZsBQAAAAAG_AQEAAAABwAEBAAAAAcEBEAAAAAHCAQEAAAABAgAAAA0AIB4AAJwDACADAAAADQAgHgAAnAMAIB8AAJsDACABFwAA7gMAMAIAAAANACAXAACbAwAgAgAAALUCACAXAACaAwAgB40BAQCUAgAhmgFAAJgCACGbAUAAmAIAIb8BAQCUAgAhwAEBAJQCACHBARAApwIAIcIBAQCVAgAhCQQAALkCACAJAADsAgAgjQEBAJQCACGaAUAAmAIAIZsBQACYAgAhvwEBAJQCACHAAQEAlAIAIcEBEACnAgAhwgEBAJUCACEJBAAAvAIAIAkAAO4CACCNAQEAAAABmgFAAAAAAZsBQAAAAAG_AQEAAAABwAEBAAAAAcEBEAAAAAHCAQEAAAABDwcAAKADACAKAAChAwAgCwAAogMAII0BAQAAAAGaAUAAAAABmwFAAAAAAbUBAQAAAAG2AQEAAAABtwEBAAAAAbgBEAAAAAG5AQEAAAABugEBAAAAAbsBAACeAwAgvAEAAJ8DACC9ASAAAAABAdgBAQAAAAQB2AEBAAAABAMeAADsAwAg1QEAAO0DACDbAQAAOAAgBB4AAJQDADDVAQAAlQMAMNcBAACXAwAg2wEAALECADAEHgAAiwMAMNUBAACMAwAw1wEAAI4DACDbAQAAwQIAMAHYAQEAAAAEAdgBAQAAAAQEHgAA-gIAMNUBAAD7AgAw1wEAAP0CACDbAQAA_gIAMAQeAADvAgAw1QEAAPACADDXAQAA8gIAINsBAADBAgAwBB4AAOQCADDVAQAA5QIAMNcBAADnAgAg2wEAALECADADHgAA2AIAINUBAADZAgAg2wEAAJMBACAEHgAAvQIAMNUBAAC-AgAw1wEAAMACACDbAQAAwQIAMAQeAACtAgAw1QEAAK4CADDXAQAAsAIAINsBAACxAgAwBB4AAJ0CADDVAQAAngIAMNcBAACgAgAg2wEAAKECADAGAQAAtwMAIAUAALgDACALAACtAwAgDAAArgMAIKsBAACQAgAgrQEAAJACACAAAAAAAAAAAAUeAADnAwAgHwAA6gMAINUBAADoAwAg1gEAAOkDACDbAQAAqwEAIAMeAADnAwAg1QEAAOgDACDbAQAAqwEAIAgMAACuAwAgDQAArAMAIA4AAK0DACAQAACvAwAgjwEAAJACACCTAQAAkAIAIJQBAACQAgAglQEAAJACACAAAAAAAAAFHgAA4gMAIB8AAOUDACDVAQAA4wMAINYBAADkAwAg2wEAAJMBACADHgAA4gMAINUBAADjAwAg2wEAAJMBACAAAAAAAAAAAAAAAAAACx4AAM4DADAfAADSAwAw1QEAAM8DADDWAQAA0AMAMNcBAADRAwAg2AEAAP4CADDZAQAA_gIAMNoBAAD-AgAw2wEAAP4CADDcAQAA0wMAMN0BAACBAwAwDwQAAL8DACAKAAChAwAgCwAAogMAII0BAQAAAAGaAUAAAAABmwFAAAAAAbQBAQAAAAG2AQEAAAABtwEBAAAAAbgBEAAAAAG5AQEAAAABugEBAAAAAbsBAACeAwAgvAEAAJ8DACC9ASAAAAABAgAAAAcAIB4AANYDACADAAAABwAgHgAA1gMAIB8AANUDACABFwAA4QMAMAIAAAAHACAXAADVAwAgAgAAAIIDACAXAADUAwAgDI0BAQCUAgAhmgFAAJgCACGbAUAAmAIAIbQBAQCUAgAhtgEBAJQCACG3AQEAlAIAIbgBEACnAgAhuQEBAJQCACG6AQEAlAIAIbsBAACEAwAgvAEAAIUDACC9ASAAhgMAIQ8EAAC-AwAgCgAAiQMAIAsAAIoDACCNAQEAlAIAIZoBQACYAgAhmwFAAJgCACG0AQEAlAIAIbYBAQCUAgAhtwEBAJQCACG4ARAApwIAIbkBAQCUAgAhugEBAJQCACG7AQAAhAMAILwBAACFAwAgvQEgAIYDACEPBAAAvwMAIAoAAKEDACALAACiAwAgjQEBAAAAAZoBQAAAAAGbAUAAAAABtAEBAAAAAbYBAQAAAAG3AQEAAAABuAEQAAAAAbkBAQAAAAG6AQEAAAABuwEAAJ4DACC8AQAAnwMAIL0BIAAAAAEEHgAAzgMAMNUBAADPAwAw1wEAANEDACDbAQAA_gIAMAAAAAAACQQAAKwDACAIAADeAwAgCQAAtwMAIBEAAN8DACDMAQAAkAIAIM8BAACQAgAg0AEAAJACACDRAQAAkAIAINIBAACQAgAgBAQAAKwDACAHAADgAwAgCgAArgMAIAsAAK0DACACAQAAtwMAIA8AAN0DACACBQAAuAMAIMoBAACQAgAgDI0BAQAAAAGaAUAAAAABmwFAAAAAAbQBAQAAAAG2AQEAAAABtwEBAAAAAbgBEAAAAAG5AQEAAAABugEBAAAAAbsBAACeAwAgvAEAAJ8DACC9ASAAAAABDQEAALYDACALAACmAwAgDAAApwMAII0BAQAAAAGaAUAAAAABmwFAAAAAAaoBAQAAAAGrAQEAAAABrAEAAKMDACCtAQIAAAABrgEQAAAAAa8BAgAAAAGwAQAApAMAIAIAAACTAQAgHgAA4gMAIAMAAAADACAeAADiAwAgHwAA5gMAIA8AAAADACABAAC1AwAgCwAA4gIAIAwAAOMCACAXAADmAwAgjQEBAJQCACGaAUAAmAIAIZsBQACYAgAhqgEBAJQCACGrAQEAlQIAIawBAADdAgAgrQECAN4CACGuARAApwIAIa8BAgDfAgAhsAEAAOACACANAQAAtQMAIAsAAOICACAMAADjAgAgjQEBAJQCACGaAUAAmAIAIZsBQACYAgAhqgEBAJQCACGrAQEAlQIAIawBAADdAgAgrQECAN4CACGuARAApwIAIa8BAgDfAgAhsAEAAOACACAQDAAAqgMAIA4AAKkDACAQAACrAwAgjQEBAAAAAY4BAQAAAAGPAQEAAAABkAEBAAAAAZEBAQAAAAGSAQEAAAABkwEBAAAAAZQBAQAAAAGVAQEAAAABlwEAAACXAQKZAQAAAJkBApoBQAAAAAGbAUAAAAABAgAAAKsBACAeAADnAwAgAwAAAK4BACAeAADnAwAgHwAA6wMAIBIAAACuAQAgDAAAmwIAIA4AAJoCACAQAACcAgAgFwAA6wMAII0BAQCUAgAhjgEBAJQCACGPAQEAlQIAIZABAQCUAgAhkQEBAJQCACGSAQEAlAIAIZMBAQCVAgAhlAEBAJUCACGVAQEAlQIAIZcBAACWApcBIpkBAACXApkBIpoBQACYAgAhmwFAAJgCACEQDAAAmwIAIA4AAJoCACAQAACcAgAgjQEBAJQCACGOAQEAlAIAIY8BAQCVAgAhkAEBAJQCACGRAQEAlAIAIZIBAQCUAgAhkwEBAJUCACGUAQEAlQIAIZUBAQCVAgAhlwEAAJYClwEimQEAAJcCmQEimgFAAJgCACGbAUAAmAIAIQaNAQEAAAABmgFAAAAAAZsBQAAAAAG3AQEAAAAByQEBAAAAAcoBAQAAAAECAAAAOAAgHgAA7AMAIAeNAQEAAAABmgFAAAAAAZsBQAAAAAG_AQEAAAABwAEBAAAAAcEBEAAAAAHCAQEAAAABDo0BAQAAAAGUAQEAAAABmQEAAADPAQKaAUAAAAABmwFAAAAAAb8BAQAAAAHAAQEAAAABywFAAAAAAcwBAQAAAAHNARAAAAABzwEBAAAAAdABQAAAAAHRAUAAAAAB0gFAAAAAAQMAAAA7ACAeAADsAwAgHwAA8gMAIAgAAAA7ACAXAADyAwAgjQEBAJQCACGaAUAAmAIAIZsBQACYAgAhtwEBAJQCACHJAQEAlAIAIcoBAQCVAgAhBo0BAQCUAgAhmgFAAJgCACGbAUAAmAIAIbcBAQCUAgAhyQEBAJQCACHKAQEAlQIAIQyNAQEAAAABmgFAAAAAAZsBQAAAAAG1AQEAAAABtgEBAAAAAbcBAQAAAAG4ARAAAAABuQEBAAAAAboBAQAAAAG7AQAAngMAILwBAACfAwAgvQEgAAAAARAMAACqAwAgDQAAqAMAIBAAAKsDACCNAQEAAAABjgEBAAAAAY8BAQAAAAGQAQEAAAABkQEBAAAAAZIBAQAAAAGTAQEAAAABlAEBAAAAAZUBAQAAAAGXAQAAAJcBApkBAAAAmQECmgFAAAAAAZsBQAAAAAECAAAAqwEAIB4AAPQDACADAAAArgEAIB4AAPQDACAfAAD4AwAgEgAAAK4BACAMAACbAgAgDQAAmQIAIBAAAJwCACAXAAD4AwAgjQEBAJQCACGOAQEAlAIAIY8BAQCVAgAhkAEBAJQCACGRAQEAlAIAIZIBAQCUAgAhkwEBAJUCACGUAQEAlQIAIZUBAQCVAgAhlwEAAJYClwEimQEAAJcCmQEimgFAAJgCACGbAUAAmAIAIRAMAACbAgAgDQAAmQIAIBAAAJwCACCNAQEAlAIAIY4BAQCUAgAhjwEBAJUCACGQAQEAlAIAIZEBAQCUAgAhkgEBAJQCACGTAQEAlQIAIZQBAQCVAgAhlQEBAJUCACGXAQAAlgKXASKZAQAAlwKZASKaAUAAmAIAIZsBQACYAgAhDo0BAQAAAAGUAQEAAAABmQEAAADPAQKaAUAAAAABmwFAAAAAAb4BAQAAAAG_AQEAAAABywFAAAAAAcwBAQAAAAHNARAAAAABzwEBAAAAAdABQAAAAAHRAUAAAAAB0gFAAAAAARANAACoAwAgDgAAqQMAIBAAAKsDACCNAQEAAAABjgEBAAAAAY8BAQAAAAGQAQEAAAABkQEBAAAAAZIBAQAAAAGTAQEAAAABlAEBAAAAAZUBAQAAAAGXAQAAAJcBApkBAAAAmQECmgFAAAAAAZsBQAAAAAECAAAAqwEAIB4AAPoDACADAAAArgEAIB4AAPoDACAfAAD-AwAgEgAAAK4BACANAACZAgAgDgAAmgIAIBAAAJwCACAXAAD-AwAgjQEBAJQCACGOAQEAlAIAIY8BAQCVAgAhkAEBAJQCACGRAQEAlAIAIZIBAQCUAgAhkwEBAJUCACGUAQEAlQIAIZUBAQCVAgAhlwEAAJYClwEimQEAAJcCmQEimgFAAJgCACGbAUAAmAIAIRANAACZAgAgDgAAmgIAIBAAAJwCACCNAQEAlAIAIY4BAQCUAgAhjwEBAJUCACGQAQEAlAIAIZEBAQCUAgAhkgEBAJQCACGTAQEAlQIAIZQBAQCVAgAhlQEBAJUCACGXAQAAlgKXASKZAQAAlwKZASKaAUAAmAIAIZsBQACYAgAhB40BAQAAAAGaAUAAAAABmwFAAAAAAb4BAQAAAAG_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_AQEAlAIAIcABAQCUAgAhywFAAJgCACHMAQEAlQIAIc0BEACnAgAhzwEBAJUCACHQAUAAyAIAIdEBQADIAgAh0gFAAMgCACESBAAAygIAIAgAAMsCACAJAAD3AgAgjQEBAJQCACGUAQEAlAIAIZkBAADHAs8BIpoBQACYAgAhmwFAAJgCACG-AQEAlAIAIb8BAQCUAgAhwAEBAJQCACHLAUAAmAIAIcwBAQCVAgAhzQEQAKcCACHPAQEAlQIAIdABQADIAgAh0QFAAMgCACHSAUAAyAIAIQmNAQEAAAABmQEAAADIAQKaAUAAAAABmwFAAAAAAcMBAQAAAAHEAQEAAAABxQEBAAAAAcYBEAAAAAHIAUAAAAABBAQAAwgABAkAAhEiCgUGAAsMGgcNBAMOGQEQHgoFAQACBQgEBgAJCxQBDBUHBQQAAwYACAcABQoOBwsRAQIFCQQGAAYBBQoAAwQAAwgABAkAAgIKEgALEwADBRYACxcADBgAAgEAAg8AAQMMIAAOHwAQIQAAAwQAAwgABAkAAgMEAAMIAAQJAAIFBgAQJAARJQASJgATJwAUAAAAAAAFBgAQJAARJQASJgATJwAUAAADBgAZJgAaJwAbAAAAAwYAGSYAGicAGwIBAAIPAAECAQACDwABBQYAICQAISUAIiYAIycAJAAAAAAABQYAICQAISUAIiYAIycAJAMEAAMIAAQJAAIDBAADCAAECQACBQYAKSQAKiUAKyYALCcALQAAAAAABQYAKSQAKiUAKyYALCcALQIEAAMHAAUCBAADBwAFBQYAMiQAMyUANCYANScANgAAAAAABQYAMiQAMyUANCYANScANgEBAAIBAQACBQYAOyQAPCUAPSYAPicAPwAAAAAABQYAOyQAPCUAPSYAPicAPwAAAwYARCYARScARgAAAAMGAEQmAEUnAEYSAgETIwEUJAEVJQEWJgEYKAEZKgwaKw0bLQEcLwwdMA4gMQEhMgEiMwwoNg8pNxUqOQUrOgUsPQUtPgUuPwUvQQUwQwwxRBYyRgUzSAw0SRc1SgU2SwU3TAw4Txg5UBw6UQo7Ugo8Uwo9VAo-VQo_VwpAWQxBWh1CXApDXgxEXx5FYApGYQpHYgxIZR9JZiVKZwdLaAdMaQdNagdOawdPbQdQbwxRcCZScgdTdAxUdSdVdgdWdwdXeAxYeyhZfC5afQRbfgRcfwRdgAEEXoEBBF-DAQRghQEMYYYBL2KIAQRjigEMZIsBMGWMAQRmjQEEZ44BDGiRATFpkgE3apQBA2uVAQNslwEDbZgBA26ZAQNvmwEDcJ0BDHGeAThyoAEDc6IBDHSjATl1pAEDdqUBA3emAQx4qQE6eaoBQHqsAQJ7rQECfLABAn2xAQJ-sgECf7QBAoABtgEMgQG3AUGCAbkBAoMBuwEMhAG8AUKFAb0BAoYBvgEChwG_AQyIAcIBQ4kBwwFH"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config2.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config2);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  ServicesScalarFieldEnum: () => ServicesScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TechnicianProfileScalarFieldEnum: () => TechnicianProfileScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.8.0",
  engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Booking: "Booking",
  Category: "Category",
  Payment: "Payment",
  Review: "Review",
  Services: "Services",
  TechnicianProfile: "TechnicianProfile",
  User: "User"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var BookingScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  technicianId: "technicianId",
  serviceId: "serviceId",
  scheduledDate: "scheduledDate",
  address: "address",
  note: "note",
  totalAmount: "totalAmount",
  status: "status",
  cancelReason: "cancelReason",
  acceptedAt: "acceptedAt",
  canceledAt: "canceledAt",
  completedAt: "completedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  icon: "icon",
  description: "description",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  bookingId: "bookingId",
  userId: "userId",
  transactionId: "transactionId",
  paymentIntentId: "paymentIntentId",
  amount: "amount",
  status: "status",
  paidAt: "paidAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  serviceId: "serviceId",
  customerId: "customerId",
  technicianId: "technicianId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ServicesScalarFieldEnum = {
  id: "id",
  technicianProfileId: "technicianProfileId",
  categoryId: "categoryId",
  title: "title",
  description: "description",
  price: "price",
  type: "type",
  duration: "duration",
  location: "location",
  availableAt: "availableAt",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TechnicianProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  bio: "bio",
  skills: "skills",
  experience: "experience",
  hourlyRate: "hourlyRate",
  completedJobs: "completedJobs",
  availability: "availability",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  password: "password",
  phone: "phone",
  profileImage: "profileImage",
  address: "address",
  city: "city",
  role: "role",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Role = {
  CUSTOMER: "CUSTOMER",
  TECHNICIAN: "TECHNICIAN",
  ADMIN: "ADMIN"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED"
};
var BookingStatus = {
  REQUESTED: "REQUESTED",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";

// src/utility/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, expiresIn) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var jwtVerify = (token, secret) => {
  const tokenVerify = jwt.verify(token, secret);
  if (typeof tokenVerify === "string") {
    return false;
  }
  return tokenVerify;
};
var jwtToken = {
  createToken,
  jwtVerify
};

// src/modules/auth/auth.service.ts
import jwt2 from "jsonwebtoken";
var userRegisterIntoDB = async (payload) => {
  const { firstName, lastName, email, password, phone, address, city, role, status } = payload;
  if (email) {
    const isUser = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (isUser) {
      throw new Error("User already exists");
    }
  }
  const hasPass = await bcrypt.hash(password, Number(env_default.solt_or_rounds));
  const userData = {
    firstName,
    lastName,
    email,
    password: hasPass,
    phone,
    address,
    city,
    role,
    status: status || "ACTIVE"
  };
  const technicianData = {
    bio: payload.bio ?? null,
    skills: payload.skills ?? [],
    experience: payload.experience !== void 0 ? Number(payload.experience) : null,
    hourlyRate: payload.hourlyRate !== void 0 ? new prismaNamespace_exports.Decimal(payload.hourlyRate) : new prismaNamespace_exports.Decimal(0),
    availability: payload.availability ?? []
  };
  const transectionResult = await prisma.$transaction(
    async (tx) => {
      const createdUser = await tx.user.create({
        data: userData,
        omit: {
          password: true
        }
      });
      if (payload.role === "TECHNICIAN") {
        await tx.technicianProfile.create({
          data: {
            ...technicianData,
            userId: createdUser.id
          }
        });
      }
      const user = await tx.user.findUnique({
        where: { email },
        omit: {
          password: true,
          createdAt: true,
          updatedAt: true
        },
        include: {
          technicianProfile: true
        }
      });
      return user;
    },
    {
      maxWait: 5e4,
      timeout: 1e5
      // for network issues
    }
  );
  return transectionResult;
};
var userLoginFromDB = async (payload) => {
  const { email, password } = payload;
  console.log("payload ", payload);
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    return null;
  }
  const pass = user.password;
  const isMatch = await bcrypt.compare(password, pass);
  if (!isMatch) {
    return "invalid";
  }
  const { id, firstName, lastName, role, phone, status } = user;
  const jwtPayload = {
    id,
    firstName,
    lastName,
    role,
    phone,
    status
  };
  console.log("jwt payload ", jwtPayload);
  const accessToken = jwtToken.createToken(
    jwtPayload,
    env_default.jwt_access_sectet,
    env_default.jwt_access_expires_in
  );
  const refreshToken = jwtToken.createToken(
    jwtPayload,
    env_default.jwt_refresh_secret,
    env_default.jwt_refresh_expires_in
  );
  const result = {
    accessToken,
    refreshToken
  };
  return result;
};
var generateAccessToken = async (token) => {
  if (!token) {
    return "unauthorized";
  }
  const decoded = jwt2.verify(
    token,
    env_default.jwt_refresh_secret
  );
  const { id } = decoded;
  const isUser = await prisma.user.findUnique({
    where: { id }
  });
  const jwtPayload = {
    id: isUser?.id,
    firstName: isUser?.firstName,
    lastName: isUser?.lastName,
    role: isUser?.role,
    phone: isUser?.phone,
    status: isUser?.status
  };
  const accessToken = jwtToken.createToken(
    jwtPayload,
    env_default.jwt_access_sectet,
    env_default.jwt_access_expires_in
  );
  return accessToken;
};
var getMeFromDB = async (role, id) => {
  const query = {
    where: { id },
    omit: {
      password: true,
      createdAt: true,
      updatedAt: true
    }
  };
  if (role === "TECHNICIAN") {
    query.include = {
      technicianProfile: true
    };
  }
  const result = await prisma.user.findUnique(query);
  return result;
};
var authService = {
  userRegisterIntoDB,
  userLoginFromDB,
  generateAccessToken,
  getMeFromDB
};

// src/modules/auth/auth.controller.ts
import httpCode2 from "http-status";
var userRegister = catchAsync_default(
  async (req, res) => {
    const body = req.body;
    console.log("body", body);
    const result = await authService.userRegisterIntoDB(body);
    console.log("user  ", result);
    return successResponse(res, httpCode2.CREATED, "User register successfully", result);
  }
);
var userLogin = catchAsync_default(
  async (req, res) => {
    const body = req.body;
    const result = await authService.userLoginFromDB(body);
    if (!result) {
      return notFoundResponse(res, "user not found!!");
    }
    if (result === "invalid") {
      return badResponse(res, "invalid email or password");
    }
    res.cookie("refreshToken", result.refreshToken, {
      secure: false,
      // set ture in production
      httpOnly: true,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24 * 7
      // 7 days
    });
    res.cookie("accessToken", result.accessToken, {
      secure: false,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 1
      // 1 hour
    });
    successResponse(res, httpCode2.OK, "user loged in successfully", result);
  }
);
var generateAccessToken2 = catchAsync_default(async (req, res) => {
  const token = req.cookies.refreshToken;
  console.log("ok");
  const result = await authService.generateAccessToken(token);
  console.log("result === ", result);
  if (result === "unauthorized") {
    return unauthorizedResponse(res, "unauthorized access");
  }
  res.cookie("accessToken", result, {
    secure: false,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 1
    // for 1 hour
  });
  const rs = {
    accessToken: result
  };
  return successResponse(res, httpCode2.CREATED, "Access token crated successfully", rs);
});
var getMe = catchAsync_default(
  async (req, res) => {
    if (!req.user) {
      return notFoundResponse(res, "User not found!!");
    }
    const id = req.user?.id;
    const role = req.user.role;
    const result = await authService.getMeFromDB(role, id);
    if (!result) {
      return errorResponse(res, "Internal server error");
    }
    return successResponse(res, httpCode2.OK, "user retrive successfully", result);
  }
);
var authController = {
  userRegister,
  userLogin,
  generateAccessToken: generateAccessToken2,
  getMe
};

// src/modules/auth/auth.validation.ts
import { z } from "zod";
var baseSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(3),
  phone: z.string(),
  profileImage: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional()
});
var customerSchema = baseSchema.extend({
  role: z.literal("CUSTOMER")
});
var technicianSchema = baseSchema.extend({
  role: z.literal("TECHNICIAN"),
  bio: z.string().optional(),
  skills: z.array(z.string()),
  experience: z.number().optional(),
  hourlyRate: z.number(),
  availability: z.array(z.string())
});
var registerSchema = z.discriminatedUnion("role", [
  customerSchema,
  technicianSchema
]);

// src/middleware/validationRequest.ts
import httpCode3 from "http-status";
var validateData = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      const er = error.issues[0];
      const response = {
        success: false,
        statusCode: httpCode3.BAD_REQUEST,
        code: er.code,
        path: er.path,
        message: er.message
      };
      res.status(httpCode3.BAD_REQUEST).json(response);
    }
  };
};

// src/middleware/auth.ts
var roleAuth = (...roles) => {
  return catchAsync_default(async (req, res, next) => {
    const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : req.headers.authorization;
    if (!token) {
      return unauthorizedResponse(res, "Unauthorized access");
    }
    const decoded = jwtToken.jwtVerify(token, env_default.jwt_access_sectet);
    if (!decoded) {
      return unauthorizedResponse(res, "unauthorized access");
    }
    console.log("decoded", decoded);
    const { id, firstName, lastName, email, phone, status, role } = decoded;
    console.log(`loged user role "${role}" and status "${status}"`);
    console.log("permitted roles ", roles);
    if (status === "BLOCKED") {
      throw new Error("user temporary blocked");
    }
    if (!roles.includes(role)) {
      return forbiddenResponse(res, "do not permit for you");
    }
    req.user = {
      id,
      firstName,
      lastName,
      email,
      phone,
      role,
      status
    };
    next();
  });
};
var authorization = {
  roleAuth
};

// src/modules/auth/auth.route.ts
var router = Router();
router.post("/register", validateData(registerSchema), authController.userRegister);
router.post("/login", authController.userLogin);
router.post("/access-token", authController.generateAccessToken);
router.get("/me", authorization.roleAuth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN), authController.getMe);
var authRouter = router;

// src/modules/service/service.route.ts
import { Router as Router2 } from "express";

// src/modules/service/service.service.ts
var createServiceIntoDB = async (userId, payload) => {
  const { categoryId } = payload;
  const cate = await prisma.category.findUnique({
    where: {
      id: categoryId
    }
  });
  if (!cate) {
    return null;
  }
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: {
      userId
    }
  });
  if (!technicianProfile) {
    throw new Error("Internal server error");
  }
  const service = await prisma.services.create({
    data: {
      ...payload,
      type: cate.name,
      technicianProfileId: technicianProfile.id
    }
  });
  return service;
};
var allServicesFromDB = async (query) => {
  const sort = query.sortBy ? query.sortBy : "createdAt";
  const order = query.sortOrder ? query.sortOrder : "desc";
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const andConditions = [];
  if (query.search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.search,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (query.location) {
    const location = query.location;
    const arrLocation = location.split(",").map((item) => item.trim());
    andConditions.push({
      location: {
        hasSome: arrLocation
      }
    });
  }
  if (query.minPrice || query.maxPrice) {
    andConditions.push({
      price: {
        ...query.minPrice && { gte: Number(query.minPrice) },
        ...query.maxPrice && { lte: Number(query.maxPrice) }
      }
    });
  }
  if (query.type) {
    andConditions.push({
      type: query.type
    });
  }
  const services = await prisma.services.findMany({
    where: {
      AND: andConditions
    },
    include: {
      review: {
        omit: {
          createdAt: true,
          updatedAt: true,
          customerId: true,
          id: true,
          serviceId: true,
          technicianId: true
        }
      }
    },
    take: limit,
    skip: (page - 1) * limit,
    orderBy: {
      [sort]: order
    }
  });
  const total = await prisma.services.count({
    where: {
      AND: andConditions
    }
  });
  const meta = {
    total,
    page,
    limit,
    totalPage: Math.ceil(total / limit)
  };
  return {
    services,
    meta
  };
};
var updateServiceIntoDB = async (id, userId, payload) => {
  const service = await prisma.services.findUnique({
    where: { id }
  });
  if (!service) {
    return null;
  }
  console.log("service", service);
  const pId = service.technicianProfileId;
  const profile = await prisma.technicianProfile.findUnique({
    where: { userId }
  });
  if (pId !== profile?.id) {
    return "unauth";
  }
  const hasPendingRequest = await prisma.booking.findFirst({
    where: { serviceId: id, status: "REQUESTED" }
  });
  if (hasPendingRequest) {
    throw new Error("Cannot update service while there are pending booking requests");
  }
  const updated = await prisma.services.update({
    where: { id },
    data: payload
  });
  return updated;
};
var serviceService = {
  createServiceIntoDB,
  allServicesFromDB,
  updateServiceIntoDB
};

// src/modules/service/service.controller.ts
import httpCode4 from "http-status";
var createService = catchAsync_default(
  async (req, res) => {
    const body = req.body;
    const technichianId = req.user?.id;
    const result = await serviceService.createServiceIntoDB(technichianId, body);
    if (!result) {
      return notFoundResponse(res, "This category not found. please added valid category");
    }
    return successResponse(res, httpCode4.CREATED, "Service created successfully", result);
  }
);
var getAllServices = catchAsync_default(
  async (req, res) => {
    const result = await serviceService.allServicesFromDB(req.query);
    if (result.services.length === 0) {
      return notFoundResponse(res, "sercices not found");
    }
    return successResponse(res, httpCode4.OK, "Services retrive successfully", result.services, result.meta);
  }
);
var updateService = catchAsync_default(
  async (req, res) => {
    const id = req.params.serviceId;
    const userId = req.user?.id;
    const result = await serviceService.updateServiceIntoDB(id, userId, req.body);
    if (result === "unauth") {
      return unauthorizedResponse(res, "unauthorized access");
    }
    if (!result) {
      return notFoundResponse(res, "service not fouond!");
    }
    return successResponse(res, httpCode4.OK, "servcie updated successfully", result);
  }
);
var serviceController = {
  createService,
  getAllServices,
  updateService
};

// src/modules/service/service.route.ts
var route = Router2();
route.post("/", authorization.roleAuth(Role.TECHNICIAN), serviceController.createService);
route.get("/", serviceController.getAllServices);
route.put("/:serviceId", authorization.roleAuth(Role.TECHNICIAN), serviceController.updateService);
var serviceRouter = route;

// src/middleware/globalError.ts
import httpCode5 from "http-status";
var globalError = (err, req, res, next) => {
  let statusCode;
  let errorName = err.name || "Internal Server Error!";
  let message = err.message || "Internal Server Error!";
  let error = err.stack;
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpCode5.CONFLICT;
      message = "A record with this value already exists";
    } else if (err.code === "P2003") {
      statusCode = httpCode5.BAD_REQUEST;
      message = "The provided relational ID reference is invalid or does not exist";
    } else if (err.code === "P2006") {
      statusCode = httpCode5.BAD_REQUEST;
      message = "Invalid fields for model schema";
    } else if (err.code === "P2007") {
      statusCode = httpCode5.UNPROCESSABLE_ENTITY;
      message = "Data validatioon error";
    } else if (err.code === "P2015") {
      statusCode = httpCode5.NOT_FOUND;
      message = "The requested related resource could not be found.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = httpCode5.INTERNAL_SERVER_ERROR;
      message = "An internal server error occured";
    } else if (err.errorCode === "P1001") {
      statusCode = httpCode5.INTERNAL_SERVER_ERROR;
      message = "Service temporarily unavailable";
    } else if (err.errorCode === "P1002") {
      statusCode = httpCode5.INTERNAL_SERVER_ERROR;
      message = "The server took too long to respond";
    } else if (err.errorCode === "P1003") {
      statusCode = httpCode5.INTERNAL_SERVER_ERROR;
      message = "Internal system database configuration error";
    } else if (err.errorCode === "P1008") {
      statusCode = httpCode5.INTERNAL_SERVER_ERROR;
      message = "The request timed out internally. Please try again.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = httpCode5.BAD_REQUEST;
    message = "Incorrect fields or missing fields";
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    statusCode = httpCode5.INTERNAL_SERVER_ERROR;
    message = "A critical system error occurred. The team has been notified";
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = httpCode5.INTERNAL_SERVER_ERROR;
    message = "An unexpected database error occurred while processing your request";
  }
  const response = {
    status: false,
    statusCode,
    errorName,
    message,
    error
  };
  res.status(httpCode5.INTERNAL_SERVER_ERROR).json(response);
};

// src/modules/user/user.route.ts
import { Router as Router3 } from "express";

// src/modules/user/user.service.ts
import bcrypt2 from "bcrypt";
var getProfileFromDB = async (role, id) => {
  const query = {
    where: { id },
    omit: {
      password: true,
      createdAt: true,
      updatedAt: true
    }
  };
  if (role === "TECHNICIAN") {
    query.include = {
      technicianProfile: true
    };
  }
  const result = await prisma.user.findUnique(query);
  return result;
};
var updateProfileIntoDB = async (userId, payload) => {
  const isUser = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!isUser) {
    throw new Error("User not found");
  }
  const userData = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
    profileImage: payload.profileImage,
    address: payload.address,
    city: payload.city
  };
  const result = await prisma.$transaction(
    async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: userData,
        omit: {
          password: true
        }
      });
      if (isUser.role !== "TECHNICIAN") {
        return updatedUser;
      }
      const technicianData = {
        bio: payload.bio,
        skills: payload.skills,
        experience: payload.experience === void 0 ? void 0 : payload.experience === null ? null : Number(payload.experience),
        hourlyRate: payload.hourlyRate !== void 0 ? new prismaNamespace_exports.Decimal(payload.hourlyRate) : void 0,
        availability: payload.availability
      };
      const updatedTechnicianProfile = await tx.technicianProfile.update({
        where: { userId },
        data: technicianData
      });
      return {
        ...updatedUser,
        technicianProfile: updatedTechnicianProfile
      };
    }
  );
  return result;
};
var updatePassIntoDB = async (id, payload) => {
  const { password } = payload;
  if (!password) {
    return "not";
  }
  console.log("pass", password);
  const hasPass = await bcrypt2.hash(password, Number(env_default.solt_or_rounds));
  await prisma.user.update({
    where: { id },
    data: {
      password: hasPass
    }
  });
};
var deleteProfileFromDB = async (id) => {
  await prisma.user.delete({
    where: { id }
  });
};
var userService = {
  getProfileFromDB,
  updateProfileIntoDB,
  updatePassIntoDB,
  deleteProfileFromDB
};

// src/modules/user/user.controller.ts
import httpCode6 from "http-status";
var getProfile = catchAsync_default(
  async (req, res) => {
    const id = req.user?.id;
    const role = req.user?.role;
    const result = await userService.getProfileFromDB(role, id);
    if (!result) {
      return errorResponse(res, "Internal server error");
    }
    return successResponse(res, httpCode6.OK, "user retrive successfully", result);
  }
);
var updateProfile = catchAsync_default(
  async (req, res) => {
    const userId = req.user?.id;
    const body = req.body;
    const result = await userService.updateProfileIntoDB(userId, body);
    return successResponse(res, httpCode6.OK, "Profile updated successfully", result);
  }
);
var updatePass = catchAsync_default(
  async (req, res) => {
    const id = req.user?.id;
    const body = req.body;
    const result = await userService.updatePassIntoDB(id, body);
    if (result === "not") {
      return badResponse(res, "Entire the password");
    }
    return successResponse(res, httpCode6.OK, "Password updated successfully");
  }
);
var deleteUser = catchAsync_default(
  async (req, res) => {
    const id = req.user?.id;
    await userService.deleteProfileFromDB(id);
    return successResponse(res, httpCode6.OK, "user deleted successfully");
  }
);
var userController = {
  getProfile,
  updateProfile,
  updatePass,
  deleteUser
};

// src/modules/user/user.route.ts
var route2 = Router3();
route2.get("/profile", authorization.roleAuth(Role.CUSTOMER), userController.getProfile);
route2.put("/profile", authorization.roleAuth(Role.CUSTOMER), userController.updateProfile);
route2.patch("/change-password", authorization.roleAuth(Role.CUSTOMER), userController.updatePass);
route2.delete("/delete", authorization.roleAuth(Role.CUSTOMER), userController.deleteUser);
var userRouter = route2;

// src/middleware/notFound.ts
var notFound = (req, res) => {
  res.status(404).json({
    status: false,
    message: "Route not found",
    path: req.originalUrl
  });
};

// src/modules/category/category.route.ts
import { Router as Router4 } from "express";

// src/modules/category/category.service.ts
var getAllCategoryFromDB = async (query) => {
  const sort = query.sortBy ? query.sortBy : "createdAt";
  const order = query.sortOrder ? query.sortOrder : "desc";
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 15);
  const category = await prisma.category.findMany({
    take: limit,
    skip: (page - 1) * limit
  });
  const total = await prisma.category.count();
  const meta = {
    total,
    page,
    limit,
    totalPage: Math.ceil(total / limit)
  };
  return {
    category,
    meta
  };
};
var categoryService = {
  getAllCategoryFromDB
};

// src/modules/category/category.controller.ts
import httpCode7 from "http-status";
var getAllCategory = catchAsync_default(
  async (req, res) => {
    const result = await categoryService.getAllCategoryFromDB(req.query);
    if (result.category.length === 0) {
      return notFoundResponse(res, "No categories found");
    }
    return successResponse(res, httpCode7.OK, "Categories retrive successfully", result.category, result.meta);
  }
);
var categoryController = {
  getAllCategory
};

// src/modules/category/category.route.ts
var route3 = Router4();
route3.get("/", categoryController.getAllCategory);
var categoryRouter = route3;

// src/modules/technician/technician.route.ts
import { Router as Router5 } from "express";

// src/modules/technician/technician.service.ts
var getTechnicianFromDB = async (query) => {
  const sort = query.sortBy ? query.sortBy : "createdAt";
  const order = query.sortOrder ? query.sortOrder : "desc";
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const andConditions = [];
  andConditions.push({
    status: UserStatus.ACTIVE
  });
  andConditions.push({
    role: Role.TECHNICIAN
  });
  if (query.skills) {
    const skills = query.skills;
    const arrSkills = skills.split(",").map((item) => item.trim());
    andConditions.push({
      technicianProfile: {
        skills: {
          hasSome: arrSkills
        }
      }
    });
  }
  if (query.minExperience || query.maxExperience) {
    andConditions.push({
      technicianProfile: {
        experience: {
          ...query.minExperience && { gte: Number(query.minExperience) },
          ...query.maxExperience && { lte: Number(query.maxExperience) }
        }
      }
    });
  }
  const users = await prisma.user.findMany({
    where: {
      AND: andConditions
    },
    take: limit,
    skip: (page - 1) * limit,
    orderBy: {
      [sort]: order
    },
    omit: {
      password: true,
      createdAt: true,
      updatedAt: true
    },
    include: {
      technicianProfile: {
        omit: {
          id: true,
          userId: true,
          createdAt: true,
          updatedAt: true
        }
      }
    }
  });
  const total = await prisma.user.count({
    where: {
      AND: andConditions
    }
  });
  const meta = {
    total,
    page,
    limit,
    totalPage: Math.ceil(total / limit)
  };
  return {
    meta,
    users
  };
};
var getTechnicianByIdFromDB = async (id) => {
  const technician = await prisma.user.findUnique({
    where: { id },
    omit: {
      password: true
    },
    include: {
      technicianProfile: {
        omit: {
          id: true,
          userId: true,
          createdAt: true,
          updatedAt: true
        },
        include: {
          reviews: {
            omit: {
              serviceId: true,
              customerId: true,
              technicianId: true
            }
          }
        }
      }
    }
  });
  return technician;
};
var getBookingFromDB = async (userId) => {
  const techProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId }
  });
  const technicianId = techProfile?.id;
  const bookings = await prisma.booking.findMany({
    where: { technicianId },
    include: {
      service: true
    }
  });
  return bookings;
};
var updateBookingStatusFromDB = async (id, payload) => {
  const booking = await prisma.booking.findUnique({
    where: { id }
  });
  if (!booking) {
    return null;
  }
  let updateData = {};
  if ((booking.status === "REQUESTED" || booking.status === "DECLINED") && payload.status === "ACCEPTED") {
    updateData = {
      status: "ACCEPTED",
      acceptedAt: /* @__PURE__ */ new Date(),
      canceledAt: null,
      cancelReason: null
    };
  } else if (booking.status === "REQUESTED" && payload.status === "DECLINED") {
    updateData = {
      status: "DECLINED",
      canceledAt: /* @__PURE__ */ new Date(),
      cancelReason: payload.cancelReason
    };
  } else if (booking.status === "IN_PROGRESS" && payload.status === "COMPLETED") {
    updateData = {
      status: "COMPLETED",
      completedAt: /* @__PURE__ */ new Date()
    };
  } else {
    throw new Error(
      `Invalid status transition: ${booking.status} -> ${payload.status}`
    );
  }
  const transectionResult = await prisma.$transaction(
    async (tx) => {
      const bookingUpdated = await tx.booking.update({
        where: { id },
        data: updateData
      });
      if (payload.status === "COMPLETED") {
        await tx.technicianProfile.update({
          where: {
            id: booking.technicianId
          },
          data: {
            completedJobs: {
              increment: 1
            }
          }
        });
      }
      return bookingUpdated;
    }
  );
  return transectionResult;
};
var incommigBooking = async (id) => {
  const booking = await prisma.booking.findMany({
    where: {
      technicianId: id,
      status: "REQUESTED"
    },
    include: {
      service: true,
      technician: {
        include: {
          user: true
        }
      }
    }
  });
  return booking.map((book) => ({
    bookingId: book.id,
    customerName: `${book.technician.user.firstName} ${book.technician.user.lastName ?? ""}`.trim(),
    serviceName: book.service.title,
    scheduledDate: book.scheduledDate,
    address: book.address,
    note: book.note,
    totalAmount: Number(book.totalAmount),
    status: book.status,
    createdAt: book.createdAt
  }));
};
var setAvailabilityIntoDB = async (id, payload) => {
  const { availability } = payload;
  const updated = await prisma.technicianProfile.update({
    where: {
      userId: id
    },
    data: {
      availability
    }
  });
  return updated;
};
var technicianService = {
  getTechnicianFromDB,
  getTechnicianByIdFromDB,
  getBookingFromDB,
  updateBookingStatusFromDB,
  incommigBooking,
  setAvailabilityIntoDB
};

// src/modules/technician/technician.controller.ts
import httpCode8 from "http-status";

// src/modules/booking/booking.service.ts
var createBooking = async (customerId, payload) => {
  console.log(payload);
  const { serviceId } = payload;
  const isService = await prisma.services.findUnique({
    where: {
      id: serviceId,
      isActive: true
    }
  });
  if (!isService) {
    return "not service";
  }
  const user = await prisma.user.findUnique({
    where: { id: customerId }
  });
  if (user?.status === UserStatus.BLOCKED) {
    throw new Error("you are temporary BLOCKED now. please ACTIVE first then create booking");
  }
  const technicianId = isService.technicianProfileId;
  const totalAmount = isService.price;
  const bookingCreate = await prisma.booking.create({
    data: {
      ...payload,
      totalAmount,
      technicianId,
      serviceId,
      customerId
    }
  });
  return bookingCreate;
};
var getBooking = async (customerId) => {
  const bookings = await prisma.booking.findMany({
    where: { customerId },
    select: {
      id: true,
      scheduledDate: true,
      status: true,
      totalAmount: true,
      service: {
        select: {
          title: true
        }
      },
      technician: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      }
    }
  });
  return bookings.map((booking) => ({
    id: booking.id,
    serviceTitle: booking.service.title,
    technicianName: `${booking.technician.user.firstName} ${booking.technician.user.lastName ?? ""}`.trim(),
    scheduledDate: booking.scheduledDate,
    status: booking.status,
    totalAmount: Number(booking.totalAmount)
  }));
};
var getBookingById = async (id) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: true,
      payment: true,
      technician: true
    }
  });
  return booking;
};
var cancleBookingFromDB = async (userId, bookingId, payload) => {
  const { cancelReason } = payload;
  const transectionResult = await prisma.$transaction(
    async (tx) => {
      const book = await tx.booking.findUnique({
        where: { id: bookingId }
      });
      if (!book) {
        return null;
      }
      if (book.status !== "IN_PROGRESS") {
        throw new Error(`you can't cancel booking`);
      }
      const updated = await tx.booking.update({
        where: {
          id: bookingId,
          customerId: userId
        },
        data: {
          status: BookingStatus.CANCELLED,
          cancelReason,
          canceledAt: /* @__PURE__ */ new Date()
        }
      });
      await tx.payment.update({
        where: { bookingId },
        data: {
          status: PaymentStatus.REFUNDED
        }
      });
      return updated;
    },
    {
      maxWait: 2e4,
      timeout: 2e4
    }
  );
  return transectionResult;
};
var bookingService = {
  createBooking,
  getBooking,
  getBookingById,
  cancleBookingFromDB
};

// src/modules/technician/technician.controller.ts
var getProfile2 = catchAsync_default(
  async (req, res) => {
    const id = req.user?.id;
    const role = req.user?.role;
    const result = await userService.getProfileFromDB(role, id);
    if (!result) {
      return errorResponse(res, "Internal server error");
    }
    return successResponse(res, httpCode8.OK, "user retrive successfully", result);
  }
);
var updateProfile2 = catchAsync_default(
  async (req, res) => {
    const userId = req.user?.id;
    const body = req.body;
    const result = await userService.updateProfileIntoDB(userId, body);
    return successResponse(res, httpCode8.OK, "Profile updated successfully", result);
  }
);
var updatePass2 = catchAsync_default(
  async (req, res) => {
    const id = req.user?.id;
    const body = req.body;
    const result = await userService.updatePassIntoDB(id, body);
    if (result === "not") {
      return badResponse(res, "Entire the password");
    }
    return successResponse(res, httpCode8.OK, "Password updated successfully");
  }
);
var getAllTechnician = catchAsync_default(
  async (req, res) => {
    const result = await technicianService.getTechnicianFromDB(req.query);
    if (!result.users.length) {
      return notFoundResponse(res, "Technician not found!");
    }
    return successResponse(res, httpCode8.OK, "All technician retrive successfully", result.users, result.meta);
  }
);
var getTechnicianById = catchAsync_default(
  async (req, res) => {
    const id = req.params.technicianId;
    const result = await technicianService.getTechnicianByIdFromDB(id);
    if (!result) {
      return notFoundResponse(res, "Technician not found!");
    }
    return successResponse(res, httpCode8.OK, "All technician retrive successfully", result);
  }
);
var getBooking2 = catchAsync_default(
  async (req, res) => {
    const userId = req.user?.id;
    const result = await technicianService.getBookingFromDB(userId);
    if (result.length === 0) {
      return notFoundResponse(res, "not booking found");
    }
    return successResponse(res, httpCode8.OK, "Booking retrived successfully", result);
  }
);
var getBookingById2 = catchAsync_default(
  async (req, res) => {
    const id = req.params.bookingId;
    const result = await bookingService.getBookingById(id);
    if (!result) {
      return notFoundResponse(res, "Booking is not found");
    }
    return successResponse(res, httpCode8.CREATED, "Booking created successfully", result);
  }
);
var updateBookingStatus = catchAsync_default(
  async (req, res) => {
    const id = req.params.bookingId;
    const body = req.body;
    const result = await technicianService.updateBookingStatusFromDB(id, body);
    if (!result) {
      return notFoundResponse(res, "booking not found");
    }
    return successResponse(res, httpCode8.OK, "Booking updated successfully", result);
  }
);
var incommingbook = catchAsync_default(
  async (req, res) => {
    const id = req.user?.id;
    const result = await technicianService.incommigBooking(id);
    if (!result) {
      return notFoundResponse(res, "no requested booking");
    }
    return successResponse(res, httpCode8.OK, "new booking retrive successfully", result);
  }
);
var setAvailability = catchAsync_default(
  async (req, res) => {
    const id = req.user?.id;
    const result = await technicianService.setAvailabilityIntoDB(id, req.body);
    return successResponse(res, httpCode8.OK, "updated availability time", result);
  }
);
var technicianController = {
  getProfile: getProfile2,
  updateProfile: updateProfile2,
  updatePass: updatePass2,
  getAllTechnician,
  getTechnicianById,
  getBooking: getBooking2,
  updateBookingStatus,
  incommingbook,
  setAvailability,
  getBookingById: getBookingById2
};

// src/modules/technician/technician.route.ts
var route4 = Router5();
route4.get("/profile", authorization.roleAuth(Role.TECHNICIAN), technicianController.getProfile);
route4.put("/profile", authorization.roleAuth(Role.TECHNICIAN), technicianController.updateProfile);
route4.patch("/change-password", authorization.roleAuth(Role.TECHNICIAN), technicianController.updatePass);
route4.get("/", technicianController.getAllTechnician);
route4.get("/bookings", authorization.roleAuth(Role.TECHNICIAN), technicianController.getBooking);
route4.get("/:technicianId", technicianController.getTechnicianById);
route4.get("/bookings/:bookingId", authorization.roleAuth(Role.TECHNICIAN), technicianController.getBookingById);
route4.patch("/bookings/:bookingId", authorization.roleAuth(Role.TECHNICIAN), technicianController.updateBookingStatus);
route4.get("/bookings/incomming", authorization.roleAuth(Role.TECHNICIAN), technicianController.incommingbook);
route4.patch("/availability", authorization.roleAuth(Role.TECHNICIAN), technicianController.setAvailability);
var technicianRouter = route4;

// src/modules/booking/booking.route.ts
import { Router as Router6 } from "express";

// src/modules/booking/booking.controller.ts
import httpcode from "http-status";
var createBooking2 = catchAsync_default(
  async (req, res) => {
    const customerId = req.user?.id;
    const body = req.body;
    const result = await bookingService.createBooking(customerId, body);
    if (result === "not service") {
      return notFoundResponse(res, "service not found~~");
    }
    return successResponse(res, httpcode.CREATED, "Booking created successfully", result);
  }
);
var getBooking3 = catchAsync_default(
  async (req, res) => {
    const customerId = req.user?.id;
    const result = await bookingService.getBooking(customerId);
    if (result.length === 0) {
      return notFoundResponse(res, "You are not booking services yet");
    }
    return successResponse(res, httpcode.OK, "Booking retrived successfully", result);
  }
);
var getBookingById3 = catchAsync_default(
  async (req, res) => {
    const id = req.params.bookingId;
    const result = await bookingService.getBookingById(id);
    if (!result) {
      return notFoundResponse(res, "Booking is not found");
    }
    return successResponse(res, httpcode.CREATED, "Booking created successfully", result);
  }
);
var cancleBooking = catchAsync_default(
  async (req, res) => {
    const customerId = req.user?.id;
    const bookingId = req.params.bookingId;
    const result = await bookingService.cancleBookingFromDB(customerId, bookingId, req.body);
    if (!result) {
      return notFoundResponse(res, "booking not found");
    }
    return successResponse(res, httpcode.OK, "Booking canceled successfully", result);
  }
);
var bookingController = {
  createBooking: createBooking2,
  getBooking: getBooking3,
  getBookingById: getBookingById3,
  cancleBooking
};

// src/modules/booking/booking.route.ts
var route5 = Router6();
route5.post("/", authorization.roleAuth(Role.CUSTOMER), bookingController.createBooking);
route5.get("/", authorization.roleAuth(Role.CUSTOMER), bookingController.getBooking);
route5.get("/status", authorization.roleAuth(Role.CUSTOMER), bookingController.getBooking);
route5.get("/:bookingId", authorization.roleAuth(Role.CUSTOMER), bookingController.getBookingById);
route5.patch("/cancel/:bookingId", authorization.roleAuth(Role.CUSTOMER), bookingController.cancleBooking);
var bookingRouter = route5;

// src/modules/review/review.route.ts
import { Router as Router7 } from "express";

// src/modules/review/review.service.ts
var createReviewIntoDB = async (customerId, payload) => {
  const { bookingId, rating, comment } = payload;
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });
  if (!booking) {
    return null;
  }
  if (booking.customerId !== customerId) {
    throw new Error("You are not authorized to review this booking");
  }
  if (booking.status === "ACCEPTED") {
    throw new Error(`you did not pay yet. please pay first`);
  }
  if (booking.status !== "COMPLETED") {
    throw new Error("You are not aligeble for review!!");
  }
  const existingReview = await prisma.review.findFirst({
    where: { serviceId: booking.serviceId, customerId, technicianId: booking.technicianId }
  });
  if (existingReview) {
    throw new Error("You have already reviewed this booking");
  }
  const technicianId = booking.technicianId;
  const review = await prisma.review.create({
    data: {
      serviceId: booking.serviceId,
      customerId: booking.customerId,
      technicianId,
      rating,
      comment
    }
  });
  return review;
};
var reviewService = {
  createReviewIntoDB
};

// src/modules/review/review.controller.ts
import httpCode9 from "http-status";
var createBooking3 = catchAsync_default(
  async (req, res) => {
    const customerId = req.user?.id;
    const body = req.body;
    const result = await reviewService.createReviewIntoDB(customerId, body);
    if (!result) {
      return notFoundResponse(res, "service not found!!");
    }
    return successResponse(res, httpCode9.CREATED, "review created successfully", result);
  }
);
var reviewController = {
  createBooking: createBooking3
};

// src/modules/review/review.route.ts
var route6 = Router7();
route6.post("/", authorization.roleAuth(Role.CUSTOMER), reviewController.createBooking);
var reviewRouter = route6;

// src/modules/payment/payment.route.ts
import { Router as Router8 } from "express";

// src/lib/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(env_default.stripe_sercet_key);

// src/modules/payment/payment.utility.ts
var paymentSuccess = async (session) => {
  try {
    const bookingId = session.metadata?.bookingId;
    const customerId = session.metadata?.customerId;
    const paymentIntentId = session.payment_intent;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const transactionResult = await prisma.$transaction(
      async (tx) => {
        const payment = await tx.payment.create({
          data: {
            bookingId,
            userId: customerId,
            transactionId: paymentIntent.latest_charge,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            status: PaymentStatus.PAID,
            paidAt: /* @__PURE__ */ new Date()
          }
        });
        console.log("after payment ", payment);
        const bo = await tx.booking.update({
          where: { id: bookingId },
          data: {
            status: BookingStatus.IN_PROGRESS
          }
        });
        console.log("after updated ", bo);
        return payment;
      },
      {
        maxWait: 2e4,
        timeout: 2e4
      }
    );
    return transactionResult;
  } catch (err) {
    console.error("paymentSuccess ERROR");
    console.error(err);
    throw err;
  }
};

// src/modules/payment/payment.service.ts
var createCheckoutSession = async (userId, payload) => {
  const { bookingId } = payload;
  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId
    }
  });
  if (booking.customerId !== userId) {
    throw new Error("Unauthorized access");
  }
  if (booking.status === "IN_PROGRESS") {
    throw new Error("Already paid");
  }
  if (booking.status === "COMPLETED") {
    throw new Error("Job already completed");
  }
  if (booking.status !== "ACCEPTED") {
    throw new Error("Booking is not accepted");
  }
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "bdt",
          unit_amount: Number(booking.totalAmount) * 100,
          product_data: {
            name: `Booking #${booking.id}`,
            description: "FixItNow Service Booking"
          }
        }
      }
    ],
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${env_default.app_url}/payment/success`,
    cancel_url: `${env_default.app_url}/payment/cancel`,
    metadata: {
      bookingId: booking.id,
      customerId: booking.customerId
    }
  });
  return {
    paymentUrl: session.url
  };
};
var paymentWebhook = async (signature, payload) => {
  const endpointSecret = env_default.stripe_webhook_secret;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret
  );
  switch (event.type) {
    case "checkout.session.completed":
      console.log("seccess...");
      await paymentSuccess(event.data.object);
      break;
    default:
      console.log("Unhandled Event");
  }
};
var payHisoty = async (userId) => {
  const history2 = await prisma.payment.findMany({
    where: { userId },
    select: {
      bookingId: true,
      amount: true,
      status: true,
      transactionId: true,
      paymentIntentId: true,
      paidAt: true,
      booking: {
        select: {
          service: {
            select: {
              title: true,
              type: true,
              technician: {
                select: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  return history2.map((his) => ({
    bookingId: his.bookingId,
    technicianName: `${his.booking.service.technician.user.firstName} ${his.booking.service.technician.user.lastName ?? ""}`.trim(),
    serviceTitle: his.booking.service.title,
    serviceType: his.booking.service.type,
    amount: Number(his.amount),
    status: his.status,
    transactionId: his.transactionId,
    paymentIntentId: his.paymentIntentId,
    paidAt: his.paidAt
  }));
};
var getPaymentFromDB = async (id, userId) => {
  console.log("id", id);
  console.log("user id", userId);
  const result = await prisma.payment.findFirst({
    where: {
      id,
      userId
    },
    select: {
      id: true,
      transactionId: true,
      paymentIntentId: true,
      amount: true,
      status: true,
      paidAt: true,
      booking: {
        select: {
          serviceId: true,
          scheduledDate: true,
          address: true,
          status: true,
          customer: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              status: true
            }
          },
          service: {
            select: {
              title: true,
              category: true,
              duration: true,
              review: {
                select: {
                  rating: true,
                  comment: true
                }
              }
            }
          }
        }
      }
    }
  });
  if (!result) {
    return null;
  }
  return {
    id: result.id,
    transactionId: result.transactionId,
    paymentIntentId: result.paymentIntentId,
    amount: result.amount,
    paymentStatus: result.status,
    paidAt: result.paidAt,
    bookingStatus: result.booking.status,
    scheduledDate: result.booking.scheduledDate,
    address: result.booking.address,
    serviceId: result.booking.serviceId,
    customerName: `${result.booking.customer.firstName} ${result.booking.customer.lastName ?? ""}`.trim(),
    customerEmail: result.booking.customer.email,
    customerPhone: result.booking.customer.phone,
    customerStatus: result.booking.customer.status,
    serviceTitle: result.booking.service.title,
    serviceCategory: result.booking.service.category,
    serviceDuration: result.booking.service.duration,
    rating: result.booking.service.review?.[0]?.rating ?? null,
    comment: result.booking.service.review?.[0]?.comment ?? null
  };
};
var paymentService = {
  createCheckoutSession,
  paymentWebhook,
  payHisoty,
  getPaymentFromDB
};

// src/modules/payment/payment.controller.ts
import httpCode10 from "http-status";
var createCheckoutSession2 = catchAsync_default(
  async (req, res) => {
    const userId = req.user?.id;
    const result = await paymentService.createCheckoutSession(
      userId,
      req.body
    );
    return successResponse(
      res,
      httpCode10.CREATED,
      "Checkout session created successfully",
      result
    );
  }
);
var stripeWebhook = catchAsync_default(
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const event = req.body;
    await paymentService.paymentWebhook(signature, event);
    return res.status(200).json({ received: true });
  }
);
var history = catchAsync_default(
  async (req, res) => {
    const userId = req.user?.id;
    const result = await paymentService.payHisoty(userId);
    if (!result) {
      return notFoundResponse(res, "you are not payment yet");
    }
    return successResponse(res, httpCode10.OK, "my history retrive successfully", result);
  }
);
var getPayment = catchAsync_default(
  async (req, res) => {
    const userId = req.user?.id;
    const id = req.params.paymentId;
    const result = await paymentService.getPaymentFromDB(id, userId);
    if (!result) {
      return notFoundResponse(res, "payment not found");
    }
    return successResponse(res, httpCode10.OK, "my history retrive successfully", result);
  }
);
var paymentController = {
  createCheckoutSession: createCheckoutSession2,
  stripeWebhook,
  history,
  getPayment
};

// src/modules/payment/payment.route.ts
var route7 = Router8();
route7.post(
  "/create",
  authorization.roleAuth(Role.CUSTOMER),
  paymentController.createCheckoutSession
);
route7.post("/webhook", paymentController.stripeWebhook);
route7.get("/history", authorization.roleAuth(Role.CUSTOMER), paymentController.history);
route7.get("/:paymentId", authorization.roleAuth(Role.CUSTOMER), paymentController.getPayment);
var paymentRouter = route7;

// src/modules/admin/admin.route.ts
import { Router as Router9 } from "express";

// src/modules/admin/admin.service.ts
var getAllUsersFromDB = async (query) => {
  const sort = query.sortBy ? query.sortBy : "createdAt";
  const order = query.sortOrder ? query.sortOrder : "desc";
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const andConditions = [];
  if (query.search) {
    andConditions.push({
      OR: [
        {
          firstName: {
            contains: query.search,
            mode: "insensitive"
          }
        },
        {
          lastName: {
            contains: query.search,
            mode: "insensitive"
          }
        },
        {
          phone: {
            contains: query.search,
            mode: "insensitive"
          }
        },
        {
          address: {
            contains: query.search,
            mode: "insensitive"
          }
        },
        {
          city: {
            contains: query.search,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (query.skill) {
    const arrSkill = Array.isArray(query.skill) ? query.skill : query.skill.split(",").map((item) => item.trim());
    andConditions.push({
      technicianProfile: {
        skills: {
          hasSome: arrSkill
        }
      }
    });
  }
  if (query.verify) {
    andConditions.push({
      technicianProfile: {
        isVerified: Boolean(query.verify)
      }
    });
  }
  if (query.role) {
    andConditions.push({
      role: query.role.toUpperCase()
    });
  } else {
    andConditions.push({
      role: {
        in: [Role.CUSTOMER, Role.TECHNICIAN]
      }
    });
  }
  if (query.status) {
    andConditions.push({
      status: query.status
    });
  }
  if (query.minExperience || query.maxExperience) {
    andConditions.push({
      technicianProfile: {
        experience: {
          ...query.minExperience && { gte: Number(query.minExperience) },
          ...query.maxExperience && { lte: Number(query.maxExperience) }
        }
      }
    });
  }
  const users = await prisma.user.findMany({
    where: {
      AND: andConditions
    },
    take: limit,
    skip: (page - 1) * limit,
    orderBy: {
      [sort]: order
    },
    select: {
      id: true,
      role: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      profileImage: true,
      address: true,
      city: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      technicianProfile: {
        select: {
          id: true,
          bio: true,
          skills: true,
          experience: true,
          hourlyRate: true,
          completedJobs: true,
          isVerified: true
        }
      }
    }
  });
  const total = await prisma.user.count({
    where: {
      AND: andConditions
    }
  });
  const formattedUsers = users.map((user) => {
    const base = {
      id: user.id,
      role: user.role,
      fullName: `${user.firstName} ${user.lastName ?? ""}`.trim(),
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      address: user.address,
      city: user.city,
      status: user.status
    };
    if (user.role === Role.TECHNICIAN && user.technicianProfile) {
      return {
        ...base,
        profileId: user.technicianProfile.id,
        bio: user.technicianProfile.bio,
        skills: user.technicianProfile.skills,
        experience: user.technicianProfile.experience,
        hourlyRate: user.technicianProfile.hourlyRate,
        completedJobs: user.technicianProfile.completedJobs,
        isVerified: user.technicianProfile.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    }
    return base;
  });
  const meta = {
    total,
    page,
    limit,
    totalPage: Math.ceil(total / limit)
  };
  return {
    users: formattedUsers,
    meta
  };
};
var updateStatusIntoDB = async (userId, payload) => {
  console.log("user status ", payload);
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    return "not";
  }
  const updated = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status: payload.status
    }
  });
  return updated;
};
var getBookingFromDB2 = async () => {
  const bookings = await prisma.booking.findMany({
    select: {
      id: true,
      scheduledDate: true,
      status: true,
      totalAmount: true,
      service: {
        select: {
          title: true
        }
      },
      technician: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      }
    }
  });
  return bookings.map((booking) => ({
    id: booking.id,
    serviceTitle: booking.service.title,
    technicianName: `${booking.technician.user.firstName} ${booking.technician.user.lastName ?? ""}`.trim(),
    scheduledDate: booking.scheduledDate,
    status: booking.status,
    totalAmount: Number(booking.totalAmount)
  }));
};
var createCategoryIntoDB = async (payload) => {
  const { name, description } = payload;
  if (!name || !description) {
    return null;
  }
  const cat = await prisma.category.findUnique({
    where: {
      name
    }
  });
  if (cat) {
    return "exist";
  }
  const result = await prisma.category.create({
    data: {
      ...payload
    }
  });
  return result;
};
var updateCategoriesByIdFromDB = async (categoryId, payload) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });
  if (!category) {
    return null;
  }
  const updated = await prisma.category.update({
    where: { id: categoryId },
    data: {
      ...payload
    }
  });
  return updated;
};
var deleteCategoriesByIdFromDB = async (categoryId) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });
  if (!category) {
    return "not";
  }
  await prisma.category.delete({
    where: { id: categoryId }
  });
};
var paymentHisotyFromDB = async () => {
  const history2 = await prisma.payment.findMany({
    select: {
      bookingId: true,
      amount: true,
      status: true,
      transactionId: true,
      paymentIntentId: true,
      paidAt: true,
      booking: {
        select: {
          service: {
            select: {
              title: true,
              type: true,
              technician: {
                select: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      user: {
        select: {
          firstName: true,
          lastName: true
        }
      }
    }
  });
  return history2.map((his) => ({
    bookingId: his.bookingId,
    customerName: `${his.user.firstName} ${his.user.lastName ?? ""}`.trim(),
    technicianName: `${his.booking.service.technician.user.firstName} ${his.booking.service.technician.user.lastName ?? ""}`.trim(),
    serviceTitle: his.booking.service.title,
    serviceType: his.booking.service.type,
    amount: Number(his.amount),
    status: his.status,
    transactionId: his.transactionId,
    paymentIntentId: his.paymentIntentId,
    paidAt: his.paidAt
  }));
};
var adminService = {
  getAllUsersFromDB,
  updateStatusIntoDB,
  getBookingFromDB: getBookingFromDB2,
  createCategoryIntoDB,
  updateCategoriesByIdFromDB,
  deleteCategoriesByIdFromDB,
  paymentHisotyFromDB
};

// src/modules/admin/admin.controller.ts
import httpCode11 from "http-status";
var getAll = catchAsync_default(
  async (req, res) => {
    const query = req.query;
    const result = await adminService.getAllUsersFromDB(query);
    if (!result.users.length) {
      return notFoundResponse(res, "Users not found!");
    }
    return successResponse(res, httpCode11.OK, "All users retrive successfully", result.users, result.meta);
  }
);
var updateStatus = catchAsync_default(
  async (req, res) => {
    const id = req.params.userId;
    const body = req.body;
    const result = await adminService.updateStatusIntoDB(id, body);
    if (result === "not") {
      return notFoundResponse(res, "User not found");
    }
    return successResponse(res, httpCode11.OK, "User status updated successfully", result);
  }
);
var createCategory = catchAsync_default(
  async (req, res) => {
    const body = req.body;
    const result = await adminService.createCategoryIntoDB(body);
    if (!result) {
      return badResponse(res, "some filed missng");
    }
    if (result === "exist") {
      return badResponse(res, "Category already exists!");
    }
    return successResponse(res, httpCode11.CREATED, "Category created successfully", result);
  }
);
var getBooking4 = catchAsync_default(
  async (req, res) => {
    const result = await adminService.getBookingFromDB();
    if (result.length === 0) {
      return notFoundResponse(res, "You are not booking services yet");
    }
    return successResponse(res, httpCode11.OK, "Booking retrived successfully", result);
  }
);
var getBookingById4 = catchAsync_default(
  async (req, res) => {
    const id = req.params.bookingId;
    const result = await bookingService.getBookingById(id);
    if (!result) {
      return notFoundResponse(res, "Booking is not found");
    }
    return successResponse(res, httpCode11.CREATED, "Booking created successfully", result);
  }
);
var updateCategoryById = catchAsync_default(
  async (req, res) => {
    const categoryId = req.params.categoryId;
    const body = req.body;
    const result = await adminService.updateCategoriesByIdFromDB(categoryId, body);
    if (!result) {
      return notFoundResponse(res, "Category not found!!");
    }
    return successResponse(res, httpCode11.OK, "Category updated successfully", result);
  }
);
var deleteCategoryById = catchAsync_default(
  async (req, res) => {
    const categoryId = req.params.categoryId;
    const result = await adminService.deleteCategoriesByIdFromDB(categoryId);
    if (result === "not") {
      return notFoundResponse(res, "Category not found!!");
    }
    return successResponse(res, httpCode11.OK, "Category delted successfully", result);
  }
);
var paymentHistory = catchAsync_default(
  async (req, res) => {
    const result = await adminService.paymentHisotyFromDB();
    if (result.length === 0) {
      return notFoundResponse(res, "No payment history yet");
    }
    return successResponse(res, httpCode11.OK, "all history retrive successfully", result);
  }
);
var adminController = {
  getAll,
  updateStatus,
  getBooking: getBooking4,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  paymentHistory,
  getBookingById: getBookingById4
};

// src/modules/admin/admin.route.ts
var route8 = Router9();
route8.get("/profile", authorization.roleAuth(Role.ADMIN), userController.getProfile);
route8.put("/profile", authorization.roleAuth(Role.ADMIN), userController.updateProfile);
route8.patch("/change-password", authorization.roleAuth(Role.ADMIN), userController.updatePass);
route8.get("/users", authorization.roleAuth(Role.ADMIN), adminController.getAll);
route8.patch("/users/update-status/:userId", authorization.roleAuth(Role.ADMIN), adminController.updateStatus);
route8.post("/categories", authorization.roleAuth(Role.ADMIN), adminController.createCategory);
route8.get("/bookings", authorization.roleAuth(Role.ADMIN), adminController.getBooking);
route8.get("/bookings/:bookingId", authorization.roleAuth(Role.ADMIN), adminController.getBookingById);
route8.get("/categories", categoryController.getAllCategory);
route8.patch("/categories/:categoryId", authorization.roleAuth(Role.ADMIN), adminController.updateCategoryById);
route8.delete("/categories/:categoryId", authorization.roleAuth(Role.ADMIN), adminController.deleteCategoryById);
route8.get("/payment-history", authorization.roleAuth(Role.ADMIN), adminController.paymentHistory);
var adminRouter = route8;

// src/app.ts
var app = express();
app.get("/", (req, res) => {
  return rootResponse(res);
});
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(req.url, "=====", Date.now());
  next();
});
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users", userRouter);
app.use("/api/technicians", technicianRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/services", serviceRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/payments", paymentRouter);
app.use(notFound);
app.use(globalError);
var app_default = app;

// src/server.ts
var port = process.env.PORT || 5e3;
var main = async () => {
  try {
    app_default.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    await prisma.$connect();
    console.log("database connected successfully!");
  } catch (err) {
    await prisma.$disconnect();
    console.error("Error starting server: ", err);
    process.exit(1);
  }
};
main();
//! searching
//! filtering
//# sourceMappingURL=server.js.map