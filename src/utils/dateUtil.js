import dayjs from "dayjs";

export function format(date, format) {
  let formatStr = dayjs(date).format(format);
  return formatStr;
}

export function formatYYYYMM(date) {
  let formatStr = dayjs(date).format("YYYY-MM");
  return formatStr;
}

export function formatYYYYMMDD(date) {
  let formatStr = dayjs(date).format("YYYY-MM-DD");
  return formatStr;
}

export function formatYYYYMMDDhhmmss(date) {
  let formatStr = dayjs(date).format("YYYY-MM-DD hh:mm:ss");
  return formatStr;
}

export function formatTableColumnDate(row, column) {
  let dateTime = row[column.property];
  let formatStr;
  if (dateTime) {
    formatStr = dayjs(row[column.property]).format("YYYY-MM-DD hh:mm:ss");
  }
  return formatStr;
}
