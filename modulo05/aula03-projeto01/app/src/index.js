'use strict';

import { readFile } from 'fs/promises';
import { join } from 'path';
import pdf from 'pdf-parse';

(async () => {
  const dataBuffer = await readFile(
    join(__dirname, './../../../docs/contrato.pdf')
  );
  const data = await pdf(dataBuffer);
  console.log(data.text);
})();
