import PDFDocument from "pdfkit";
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
  const doc = new PDFDocument({
    width: 4.13 * ppi,
    height: 5.84 * ppi,
    name: "Daily Planner",
    author: "bromanko",
    size: "A6",
  });
  doc.font("templates/ArchitectsDaughter-Regular.ttf").fontSize(15);
  return doc;
};

const createDayPage = (doc, date) => {
  doc.addPage({
    size: "A6",
  });
  // const page = new PDFDocument.ExternalDocument(
  //   fs.readFileSync("templates/day.pdf")
  // );
  // return page;
};

const main = async function (year, outfile) {
  const doc = createBaseDoc();

  getDays(year)
    .map((day) => createDayPage(doc, day))
    .map((page) => {
      // doc.addPagesOf(page);
    });

  doc.pipe(fs.createWriteStream(outfile));
  doc.end();
};

const year = 2021;
await main(year, `output/${year}-planner.pdf`);
