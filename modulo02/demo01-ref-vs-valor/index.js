const { deepStrictEqual } = require("assert");

let counter = 0;
let counter2 = counter;
counter2++;
//

const item = { counter: 0 };
const item2 = item;

// tipo primitivo gera uma copia em memoria
deepStrictEqual(counter, 0);
deepStrictEqual(counter2, 1);

// tipo de referencia, copia o endereco de memoria
item2.counter++;
deepStrictEqual(item, { counter: 1 });
item2.counter++;
deepStrictEqual(item2, { counter: 2 });
