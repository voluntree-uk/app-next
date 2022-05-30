export function dateToReadable(str: string) {
  const options = {
    weekday: "long" as any,
    year: "numeric" as any,
    month: "long" as any,
    day: "numeric" as any,
  };

  const date = new Date(str);

  return date.toLocaleDateString("en-US", options);
}
