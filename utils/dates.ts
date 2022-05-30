export function dateToReadable(date: string) {
  const options = {
    weekday: "long" as any,
    year: "numeric" as any,
    month: "long" as any,
    day: "numeric" as any,
  };

  const dateObj = new Date(date);

  return dateObj.toLocaleDateString("en-US", options);
}

export function timeToReadable(start_time: string, end_time: string) {
  return `${start_time.slice(0, 5)} - ${end_time.slice(0, 5)}`;
}
