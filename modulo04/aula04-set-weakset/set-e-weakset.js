const assert = require('assert');

const arr1 = ['0', '1', '2'];
const arr2 = ['2', '0', '3'];
const arr3 = arr1.concat(arr2);
// console.log('arr3', arr3.sort())
assert.deepStrictEqual(arr3.sort(), ['0', '0', '1', '2', '2', '3']);

const set = new Set();
arr1.map((item) => set.add(item));
arr2.map((item) => set.add(item));

// console.log('Set with add item per item', set);
assert.deepStrictEqual(Array.from(set), ['0', '1', '2', '3']);
// rest/spread
assert.deepStrictEqual(Array.from(new Set([...arr1, ...arr2])), [
  '0',
  '1',
  '2',
  '3',
]);

// console.log('set.keys', set.keys());
// console.log('set.values', set.values()); // só existe por conta do Map

// no Array comum, para saber se um item existe
// [].indexOf('1') !== -1 ou [0].includes(0)
assert.ok(set.has('3'));

// mesma teoria do Map, mas voce sempre trabalha com a lista toda
// nao tem get, entao você pode saber se o item está ou nao no array
// na documentacao tem exemplos sobre como fazer uma intercecao, saber o que tem em uma lista e nao
// tem na outra e assim por diante

// tem nos dois arrays
const users01 = new Set(['patrick', 'pedro', 'mamae']);

const users02 = new Set(['andre', 'pablo', 'mamae']);

const intersection = new Set([...users01].filter((user) => users02.has(user)));
assert.deepStrictEqual(Array.from(intersection), ['mamae']);

const difference = new Set([...users01].filter((user) => !users02.has(user)));
assert.deepStrictEqual(Array.from(difference), ['patrick', 'pedro']);

// weakSet

// mesma ideia do WeakMap
// nao e enumeravel (iteravel)
// so trabalha com chaves como referencia
// so tem emtodos simples

const user = { id: 123 };
const user2 = { id: 321 };

const weakSet = new WeakSet([user]);
weakSet.add(user2);
weakSet.delete(user);
weakSet.has(user);
