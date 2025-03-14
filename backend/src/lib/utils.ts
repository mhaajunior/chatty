import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const formatDate = (date: Date): string => {
  const zonedDate = toZonedTime(date, "Asia/Bangkok");

  return format(zonedDate, "yyyy-MM-dd HH:mm:ss");
};
