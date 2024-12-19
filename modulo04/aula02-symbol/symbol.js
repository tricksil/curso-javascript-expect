const assert = require('assert');

// ---- keys
const uniqueKey = Symbol('userName');
const user = {};

user['userName'] = 'value for normal Object';
user[uniqueKey] = 'value for symbol';

// console.log('getting normal objects', user.userName);
// // sempre único em nível de endereço de memoria
// console.log('getting normal objects', user[Symbol('userName')]);
// console.log('getting normal objects', user[uniqueKey]);

assert.deepStrictEqual(user.userName, 'value for normal Object');

// sempre único em nível de endereço de memoria
assert.deepStrictEqual(user[Symbol('userName')], undefined);
assert.deepStrictEqual(user[uniqueKey], 'value for symbol');

// console.log('symbols', Object.getOwnPropertySymbols(user)[0]);

// é dificil de pegar, mas nao é secreto!
assert.deepStrictEqual(Object.getOwnPropertySymbols(user)[0], uniqueKey);

// byPass - má prática (nem tem no codebase do node)
user[Symbol.for('password')] = 123;
assert.deepStrictEqual(user[Symbol.for('password')], 123);
//  ----- keys

// Well Known Symbols
const obj = {
  [Symbol.iterator]: () => ({
    items: ['c', 'b', 'a'],
    next() {
      return {
        done: this.items.length === 0,
        // remove o ultimo e retorna
        value: this.items.pop(),
      };
    },
  }),
};

// for (const items of obj) {
//   console.log('item', items);
// }

assert.deepStrictEqual([...obj], ['a', 'b', 'c']);

const kItems = Symbol('kItems');
class MyDate {
  constructor(...args) {
    this[kItems] = args.map((arg) => new Date(...arg));
  }

  [Symbol.toPrimitive](coercionType) {
    if (coercionType !== 'string') throw new TypeError();

    const itens = this[kItems].map((item) =>
      new Intl.DateTimeFormat('pt-BR', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      }).format(item)
    );

    return new Intl.ListFormat('pt-BR', {
      style: 'long',
      type: 'conjunction',
    }).format(itens);
  }

  async *[Symbol.asyncIterator]() {
    const timeout = (ms) => new Promise((r) => setTimeout(r, ms));
    for (const item of this[kItems]) {
      await timeout(100);
      yield item.toISOString();
    }
  }

  *[Symbol.iterator]() {
    for (const item of this[kItems]) {
      yield item;
    }
  }

  get [Symbol.toStringTag]() {
    return 'WHAT?';
  }
}

const myDate = new MyDate([2020, 3, 1], [2018, 2, 2]);

const expectedDates = [new Date(2020, 3, 1), new Date(2018, 2, 2)];

assert.deepStrictEqual(
  Object.prototype.toString.call(myDate),
  '[object WHAT?]'
);

assert.throws(() => myDate + 1, TypeError);

// coercao explicita para chamar o toPrimitive
assert.deepStrictEqual(
  String(myDate),
  '01 de abril de 2020 e 02 de março de 2018'
);

assert.deepStrictEqual([...myDate], expectedDates);

// (async () => {
//   for await (const item of myDate) {
//     console.log('asyncIterator', item);
//   }
// })();

(async () => {
  const dates = await Promise.all([...myDate]);
  assert.deepStrictEqual(dates, expectedDates);
})();
