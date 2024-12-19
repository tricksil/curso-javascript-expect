'use strict';

import { readFile } from 'fs/promises';
import { join, dirname  } from 'path';
import { fileURLToPath } from 'url';
import TextProcessorFacade from './textProcessorFacade.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  const dataBuffer = await readFile(
    join(__dirname, './../../../docs/contrato.pdf')
  );
  const data = await pdfParse(dataBuffer);

  const instance = new TextProcessorFacade(data.text);
  const people = instance.getPeopleFromPDF();
  console.log('people', people);
})();
