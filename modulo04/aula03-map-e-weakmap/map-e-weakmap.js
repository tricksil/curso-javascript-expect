const assert = require('assert');
const myMap = new Map();

myMap
  .set(1, 'one')
  .set('Patrick', { text: 'two' })
  .set(true, () => 'hello');

const myMapWithConstructor = new Map([
  ['1', 'str1'],
  [1, 'num1'],
  [true, 'bool1'],
]);
// console.log('myMap', myMap);
// console.log("myMap.get('1')", myMap.get(1));
// console.log("myMap.get('Patrick')", myMap.get('Patrick'));
assert.deepStrictEqual(myMap.get(1), 'one');
assert.deepStrictEqual(myMap.get('Patrick'), { text: 'two' });
assert.deepStrictEqual(myMap.get(true)(), 'hello');

// Em objetos a chave só pode ser string ou symbol (number é coergido a string)
const onlyReferenceWorks = { id: 1 };
myMap.set(onlyReferenceWorks, { name: 'PatrickSilva' });

// console.log('get', myMap.get(onlyReferenceWorks));
assert.deepStrictEqual(myMap.get({ id: 1 }), undefined);
assert.deepStrictEqual(myMap.get(onlyReferenceWorks), { name: 'PatrickSilva' });

// utilizatarios
// - No object seria Object.keys({a: 1}).length

assert.deepStrictEqual(myMap.size, 4);

// para verificar se um item existe no objeto
// item.key = se nao existe = undefined
// if() = coercao implicita para boolean e retorna false
// O jeito certo em Object é ({ name: 'Patrick' }).hasOwnProperty('name')
assert.ok(myMap.has(onlyReferenceWorks));

// para remover umitem do objeto
// delete item.id
// imperformatico para javascript
assert.ok(myMap.delete(onlyReferenceWorks));

// Nao da para iterar em Objects diretamente
// tem que transformar com o Object.entries(item)
assert.deepStrictEqual(
  JSON.stringify([...myMap]),
  JSON.stringify([
    [1, 'one'],
    ['Patrick', { text: 'two' }],
    [true, () => {}],
  ])
);

// for (const [key, value] of myMap) {
//   console.log({ key, value });
// }

// Object é inseguro, pois dependendo do nome da chave, pode substituir algum comportamento padrao
// ({ }).toString() => '[object Object]
// ({toString: () => 'Hey}).toString() === 'Hey'

//  qualquer chave pode colidir, com as propriedades herdadas do object, como
// constructor, toString, valueOf e etc.

const actor = {
  name: 'Xuxa da Silva',
  toString: 'Queem: Xuxa da Silva',
};

// nao tem restricao de nome de chave
myMap.set(actor);

assert.ok(myMap.has(actor), null);
assert.throws(() => myMap.get(actor).toString, TypeError);

// Nao da para limpar um obj sem reassina-lo
myMap.clear();
assert.deepStrictEqual(myMap.size, 0);
assert.deepStrictEqual([...myMap.keys()], []);

// ---- WeakMap

// Pode ser coletado apos perder as referencias
// usado em casos bem especificos

// tem a maioria dos beneficios do Map
// MAS: nao e iteravel
// So chaves de referencia e que voce ja conheca
// mais leve e preve leak de memoria, pq depois que as instancias saem de memoria, tudo e limpo
const weakMap = new WeakMap();
const hero = { name: 'Flash' };

// weakMap.set(hero);
// weakMap.get(hero);
// weakMap.delete(hero);
// weakMap.has(hero);
