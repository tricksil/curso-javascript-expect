9999999999999999;
// 10000000000000000
true + 2;
// 3
"21" + true;
//  '21true'
"21" - true;
// 20
"21" - -1;
// 22
0.1 + 0.2 === 0.3;
// false
3 > 2 > 1;
// false
3 > 2 >= 1;
// true
"B" + "a" + +"a" + "a";
// 'BaNaNa'
"1" == 1;
"1" === 1;

// ------------------
console.assert(String(123) === "123", "explicit convertion to string");
console.assert(123 + "" === "123", "implicit convertion to string");
console.assert(("hello" || 123) === "hello", "|| returns the first element");
console.assert(("hello" && 123) === 123, "&& returns the last element");

// ------------------------------

const item = {
  name: "PatrickSilva",
  age: 27,
  // string: 1 se nao for primitivo, chama o valueOf
  toString() {
    return `Name: ${this.name}, Age: ${this.age}`;
  },
  // number: 1 se nao for primitivo, chama toString
  valueOf() {
    return { hey: "dude" };
    // return 007;
  },
  // ele tem prioridade na parada!
  [Symbol.toPrimitive](coercionType) {
    // console.log("trying to convert to", coercionType);
    const types = {
      string: JSON.stringify(this),
      number: "007",
    };
    return types[coercionType] || types.string;
  },
};

// console.log("toString", String(item));
// // vai retornar NaN pois o toString retornou a string
// console.log("valueOf", Number(item));

// depois de adicionar o toPrimitive
// console.log("String", String(item));
// console.log("Number", Number(item));
// // chama a conversao default!
// console.log("Date", new Date(item));

console.assert(item + 0 === '{"name":"PatrickSilva","age":27}0');
console.assert(!!item);
console.assert("Ae".concat(item) === 'Ae{"name":"PatrickSilva","age":27}');

// console.log("implicit + explicit coercion (using ==)", item == String(item));
console.assert(item == String(item));

const item2 = { ...item, name: "Zezin", age: 20 };
// console.log("New Object", item2);

console.log(item2.name === "Zezin" && item2.age === 20);
