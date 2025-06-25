export default (date: string) => {
  const newDate = new Date(date);
  return Math.floor(newDate.getTime() / 1000) + 43200;
};
