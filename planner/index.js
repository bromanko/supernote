// Take the template page

const getDays = (year) => {
  const firstDayOfYear = new Date(year, 0, 0);
  const firstDayOfNextYear = new Date(year + 1, 0, 0);

  const days = [];
  const day = firstDayOfYear;
  while (day < firstDayOfNextYear) {
    days.push(day);
    day.setDate(day.getDate() + 1);
  }
  return days;
}
const year = 2021;
getDays(year).map((d) => console.log(d));
