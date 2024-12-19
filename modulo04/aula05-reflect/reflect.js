'use strict';
const assert = require('assert');

// garantir semantica e seguranca em objetos

// ---- apply
const myObj = {
  add(myValue) {
    return this.arg1 + this.arg2 + myValue;
  },
};
// Function.prototype.apply = () => {throw new TypeError('Eita')}

assert.deepStrictEqual(myObj.add.apply({ arg1: 10, arg2: 20 }, [100]), 130);

// um problema que pode acontecer (raro)
// Function.prototype.apply = () => {throw new TypeError('Eita')}

// esse aqui pode acontecer
myObj.add.apply = function () {
  throw new TypeError('Vixxx');
};

assert.throws(() => myObj.add.apply({}, []), {
  name: 'TypeError',
  message: 'Vixxx',
});

// usando reflect:
const result = Reflect.apply(myObj.add, { arg1: 40, arg2: 20 }, [200]);
assert.deepStrictEqual(result, 260);
// ----- apply

// ----- defineProperty

// questoes semanticas
function MyDate() {}

// feio, tudo é object, mas Object adicionando prop para uma function?
Object.defineProperty(MyDate, 'withObject', { value: () => 'Hey there' });

// agora faz mais sentido
Reflect.defineProperty(MyDate, 'withReflection', { value: () => 'Hey dude' });

assert.deepStrictEqual(MyDate.withObject(), 'Hey there');
assert.deepStrictEqual(MyDate.withReflection(), 'Hey dude');
// defineProperty

// ---- deleteProperty
const withDelete = { user: 'PatrickSilva' };
// imperformatico, evitar ao maximo
delete withDelete.user;

assert.deepStrictEqual(withDelete.hasOwnProperty('user'), false);

const withReflection = { user: 'Teste user' };
Reflect.deleteProperty(withReflection, 'user');
assert.deepStrictEqual(withReflection.hasOwnProperty('user'), false);

// ---- deleteProperty

// ---- get

// Deveriamos fazer um get somente em instancias de referencia
assert.deepStrictEqual((1)['userName'], undefined);
// com reflection, uma excecao e lancada
assert.throws(() => Reflect.get(1, 'userName'), TypeError);
// ---- get

// ---- has
assert.ok('superman' in { superman: '' });
assert.ok(Reflect.has({ batman: '' }, 'batman'));
// ---- has

// ---- ownKeys
const user = Symbol('user');
const dataBaseUser = {
  id: 1,
  [Symbol.for('password')]: 123,
  [user]: 'PatrickSilva',
};

const objectKeys = [
  ...Object.getOwnPropertyNames(dataBaseUser),
  ...Object.getOwnPropertySymbols(dataBaseUser),
];
// console.log('objectKeys', objectKeys);
assert.deepStrictEqual(objectKeys, ['id', Symbol.for('password'), user]);

// com reflection, so um metodo
assert.deepStrictEqual(Reflect.ownKeys(dataBaseUser), ['id', Symbol.for('password'), user])
