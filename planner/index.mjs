import pdf from "pdfjs";
import * as fs from "fs";

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
};

const createBaseDoc = () => {
  const ppi = 72;
  return new pdf.Document({
    width: 4.13 * ppi,
    height: 5.84 * ppi,
  });
};

const main = async function (year, outfile) {
  const doc = createBaseDoc();

  getDays(year).map((d) => console.log(d));

  doc.pipe(fs.createWriteStream(outfile));
  await doc.end();
};

const year = 2021
await main(year, `${year}-planner.pdf`);
