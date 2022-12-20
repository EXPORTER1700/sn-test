export const getDateAgo = (date: Date, days: number): Date => {
  date.setDate(date.getDate() - days);
  return date;
};
