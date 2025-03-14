import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { formatDate } from "./utils";

const { combine, printf, colorize } = format;

const logFormat = printf(({ level, message }) => {
  const timestamp = formatDate(new Date());
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: "error",
  format: combine(
    colorize(), // ทำให้ข้อความใน console มีสี
    logFormat
  ),
  transports: [
    new transports.Console(), // บันทึกใน console
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log", // ใช้ %DATE% เพื่อสร้างไฟล์ใหม่ตามวันที่
      datePattern: "YYYY-MM", // กำหนดให้ log หมุนเป็นรายเดือน
      zippedArchive: true, // บีบอัดไฟล์เก่า
      maxSize: "20m", // ขนาดสูงสุดของ log ก่อนจะหมุน
      maxFiles: "12", // เก็บไฟล์ log ย้อนหลังสูงสุด 12 เดือน
    }),
  ],
});

export default logger;
