const pdf = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const outlinePdfLib = require("@lillallol/outline-pdf");
const fs = require("fs");

const PDFDocument = pdf.PDFDocument;
const rgb = pdf.rgb;
const outlinePdf = outlinePdfLib.outlinePdfFactory(pdf);

const ArchitectFont = fs.readFileSync(
  "templates/ArchitectsDaughter-Regular.ttf"
);

const getDays = (year) => {
  const firstDayOfYear = new Date(year, 0, 1);
  const firstDayOfNextYear = new Date(year + 1, 0, 1);

  const days = [];
  const day = firstDayOfYear;
  while (day < firstDayOfNextYear) {
    days.push(new Date(day.getTime()));
    day.setDate(day.getDate() + 1);
  }
  return days;
};

const createBaseDoc = async () => {
  const doc = await PDFDocument.create();
  doc.setAuthor("bromanko");
  doc.setTitle("Daily Planner");
  return doc;
};

const dayString = (date) => {
  const dayOfWeek = date.toLocaleString("en-us", { weekday: "long" });
  const month = date.toLocaleString("en-us", { month: "long" });
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();
  return `${dayOfWeek} ${month} ${dayOfMonth}, ${year}`;
};

const addDayPage = async (doc, day) => {
  const pageDoc = await PDFDocument.load(fs.readFileSync("templates/day.pdf"));
  const [page] = await doc.copyPages(pageDoc, [0]);

  doc.registerFontkit(fontkit);
  const font = await doc.embedFont(ArchitectFont);

  page.drawText(dayString(day), {
    x: 2,
    y: 379,
    size: 13,
    font,
    color: rgb(50 / 255, 50 / 255, 50 / 255),
  });
  doc.addPage(page);
};

const addOutline = async (doc) => {
  await outlinePdf.loadPdf(await doc.save());
  outlinePdf.outline = `
    1||Some random title 1
    2|-|Some random title 2
   -3|--|Some random title 3
    4|---|Some random title 4
    5|---|Some random title 5
    6|-|Some random title 6
    7||Some random title 7
    `;
  outlinePdf.applyOutlineToPdf();
  return await outlinePdf.savePdf();
};

const main = async function (year, outfile) {
  const doc = await createBaseDoc();

  await Promise.all(getDays(year).map((day) => addDayPage(doc, day)));

  const outBytes = await addOutline(doc);
  fs.writeFileSync(outfile, outBytes);
};

const year = 2021;
main(year, `output/${year}-planner.pdf`)
  .then(() => console.log("Done!"))
  .catch((e) => {
    console.error(e);
    process.exit(-1);
  });
