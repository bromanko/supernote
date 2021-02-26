const pdf = require("pdf-lib");
const fs = require("fs");
const PDFDocument = pdf.PDFDocument;

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

const createBaseDoc = async () => {
  const doc = await PDFDocument.create();
  doc.setAuthor("bromanko");
  doc.setTitle("Daily Planner");
  // doc.font("templates/ArchitectsDaughter-Regular.ttf").fontSize(15);
  return doc;
};

const addDayPage = async (doc, date) => {
  const pageDoc = await PDFDocument.load(fs.readFileSync("templates/day.pdf"));
  const [page] = await doc.copyPages(pageDoc, [0]);
  doc.addPage(page);
};

const main = async function (year, outfile) {
  const doc = await createBaseDoc();

  await Promise.all(getDays(year).map((day) => addDayPage(doc, day)));

  const outBytes = await doc.save();
  fs.writeFileSync(outfile, outBytes);
};

const year = 2021;
main(year, `output/${year}-planner.pdf`)
  .then(() => console.log("Done!"))
  .catch((e) => {
    console.error(e);
    process.exit(-1);
  });
