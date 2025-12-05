// scripts/create-data-files.js
const fs = require("fs");
const path = require("path");

const ROOT_DIR = process.cwd();
const BASE_DIR = path.join(ROOT_DIR, "src", "challenges", "years");

const DATA_FILE_CONTENT = `export const example = \`\`;
export const real = \`\`;
`;

function exists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function createDataFiles() {
  const yearDirs = fs
    .readdirSync(BASE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  if (yearDirs.length === 0) {
    console.warn("No year directories found.");
    return;
  }

  let createdCount = 0;

  for (const year of yearDirs) {
    const yearPath = path.join(BASE_DIR, year);
    const entries = fs.readdirSync(yearPath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isFile()) continue;

      const match = entry.name.match(/^day(\d{2})\.tsx$/);
      if (!match) continue;

      const day = match[1];
      const dataFileName = `day${day}.data.ts`;
      const dataFilePath = path.join(yearPath, dataFileName);

      if (exists(dataFilePath)) {
        continue;
      }

      fs.writeFileSync(dataFilePath, DATA_FILE_CONTENT, { encoding: "utf8" });
      createdCount++;

      console.log(
        `Created data file for ${year}/day${day}: ${path.relative(
          ROOT_DIR,
          dataFilePath
        )}`
      );
    }
  }

  if (createdCount === 0) {
    console.log("All data files already exist. Nothing to do ✅");
  } else {
    console.log(`Done! Created ${createdCount} data file(s) ✅`);
  }
}

createDataFiles();
