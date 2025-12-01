const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

(async function main() {
  try {
    const yearInput = await ask("Enter year (e.g. 2025): ");
    const dayInput = await ask("Enter day number (1–31): ");

    const year = yearInput;
    const dayNumber = parseInt(dayInput, 10);

    if (!year || isNaN(dayNumber) || dayNumber < 1 || dayNumber > 31) {
      console.error("❌ Invalid year or day. Aborting.");
      rl.close();
      process.exit(1);
    }

    const dayPadded = String(dayNumber).padStart(2, "0");

    const baseDir = path.join(
      process.cwd(),
      "src",
      "challenges",
      "years",
      year
    );

    const dayFilePath = path.join(baseDir, `day${dayPadded}.tsx`);
    const dataFilePath = path.join(baseDir, `day${dayPadded}.data.ts`);

    fs.mkdirSync(baseDir, { recursive: true });

    const componentTemplate = `import Template from '../../../components/Template.tsx';
import type { Meta } from '../../types';
import { real, example } from './day${dayPadded}.data.ts';

export const meta: Meta = { year: ${year}, day: ${dayNumber}, status: 'started' };

export default function Day${dayPadded}() {
  function parse(input: string) {
    return;
  }

  function one(input: string): string {
    const data = parse(input);
    let solution = 0;
    return solution.toString();
  }

  function two(input: string): string {
    const data = parse(input);
    let solution = 0;
    return solution.toString();
  }

  return (
    <Template
      meta={meta}
      methods={{ one, two }}
      input={{ example, real }}
    />
  );
}
`;
    const dataTemplate = `export const example = \`\`;
export const real = \`\`;`;

    if (fs.existsSync(dayFilePath)) {
      console.warn(`⚠️  ${dayFilePath} already exists. Skipping.`);
    } else {
      fs.writeFileSync(dayFilePath, componentTemplate, "utf8");
      console.log(`✅ Created ${dayFilePath}`);
    }

    if (fs.existsSync(dataFilePath)) {
      console.warn(`⚠️  ${dataFilePath} already exists. Skipping.`);
    } else {
      fs.writeFileSync(dataFilePath, dataTemplate, "utf8");
      console.log(`✅ Created ${dataFilePath}`);
    }

    console.log("🎉 Done!");
  } catch (err) {
    console.error("Unexpected error:", err);
  } finally {
    rl.close();
  }
})();
