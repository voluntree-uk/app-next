export function dateToReadable(date: string, include_weekday: boolean = true) {
  const options: {
    weekday?: any,
    year?: any,
    month?: any,
    day?: any
  } = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (include_weekday) options.weekday = "long";

  const dateObj = new Date(date);

  return dateObj.toLocaleDateString("en-US", options);
}

export function timeToReadable(start_time: string, end_time: string) {
  return `${start_time.slice(0, 5)} - ${end_time.slice(0, 5)}`;
}

export function dateAsISOString(date: Date = new Date()) {
  const offset = date.getTimezoneOffset()
  date = new Date(date.getTime() - (offset * 60 * 1000))
  return date.toISOString().split('T')[0]
}
