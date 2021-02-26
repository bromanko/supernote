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
    name: "Daily Planner",
    author: "bromanko",
    font: new pdf.Font(
      fs.readFileSync("templates/ArchitectsDaughter-Regular.ttf")
    ),
  });
};

const createDayPage = (date) => {
  const page = new pdf.ExternalDocument(fs.readFileSync("templates/day.pdf"));
  return page;
};

const main = async function (year, outfile) {
  const doc = createBaseDoc();

  getDays(year)
    .map(createDayPage)
    .map((page) => {
      doc.addPagesOf(page);
    });

  doc.pipe(fs.createWriteStream(outfile));
  await doc.end();
};

const year = 2021;
await main(year, `output/${year}-planner.pdf`);
