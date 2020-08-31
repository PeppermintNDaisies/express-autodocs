const createIndex = require("./createIndex");
const exec = require("@actions/exec");
const fs = require("fs");
const getBaseAPIContent = require("./getBaseAPIContent");
const generatePages = require("./generatePages");
function generateMarkdowndocs(apis, outputBranch) {
  let output_path;
  if (process.env.NODE_ENV == "production") {
    output_path = process.cwd() + "/docs";
    if (!fs.existsSync(output_path)) fs.mkdirSync(output_path);
  } else {
    output_path = process.cwd() + "/test/output";
    if (!fs.existsSync(output_path)) fs.mkdirSync(output_path);
  }
  let output_file = output_path + "/readme.md";
  let index = createIndex(apis);
  let baseContent = getBaseAPIContent(apis);
  generatePages(apis);
  const fd = fs.openSync(output_file, "w");
  let indexPage = ``;
  if (index) indexPage += index;
  if (baseContent) indexPage += baseContent;
  fs.writeFileSync(output_file, indexPage);
  fs.closeSync(fd);
  if (process.env.NODE_ENV == "production") {
    exec.exec(`git add .`);
    exec.exec(`git commit -m 'Created Docs'`);
    exec.exec(`git push origin ${outputBranch}`);
  }
}

module.exports = generateMarkdowndocs;