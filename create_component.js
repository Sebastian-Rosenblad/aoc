const fs = require('fs');
const path = require('path');

const componentName = process.argv[2];
const kebabCase = componentName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const camelCase = componentName[0].toLocaleLowerCase() + componentName.slice(1);
const displayName = componentName.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
const componentDir = `./src/days/${componentName}`;

if (!fs.existsSync(componentDir)) {
  fs.mkdirSync(componentDir, { recursive: true });

  const componentContent = `import { ${camelCase}Data } from './data';
import { ${camelCase}Example } from './example_data';

function ${componentName}() {
  const data: Array<string> = ${camelCase}Data.split(/\\r?\\n/);
  const exampleData: Array<string> = ${camelCase}Example.split(/\\r?\\n/);

  /**
   * Part 1: time 00:00:00 - rank 0000
   * Part 2: time 00:00:00 - rank 0000
   */

  function calculate(a: Array<string>, partOne: boolean): string {
    if (partOne)
      return "";
    return "";
  }

  return (
    <div className='${kebabCase}'>
      <p>${displayName[0].toLocaleUpperCase() + displayName.slice(1)}: Part 1</p>
      <h1>Answer: {calculate(data, true)}</h1>
      <h2>Example: {calculate(exampleData, true)}</h2>
      <p>Part 2</p>
      <h1>Answer: {calculate(data, false)}</h1>
      <h2>Example: {calculate(exampleData, false)}</h2>
    </div>
  );
}

export default ${componentName};
`;

  fs.writeFileSync(path.join(componentDir, `${componentName}.tsx`), componentContent);
  fs.writeFileSync(path.join(componentDir, 'data.ts'), `export const ${camelCase}Data:string=\`\`;`);
  fs.writeFileSync(path.join(componentDir, 'example_data.ts'), `export const ${camelCase}Example:string=\`\`;`);
}
