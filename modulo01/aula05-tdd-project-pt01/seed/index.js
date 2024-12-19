const { faker } = require("@faker-js/faker");

const Car = require("../src/entities/car");
const CarCategory = require("../src/entities/carCategory");
const Customer = require("../src/entities/customer");
const { join } = require("path");
const { writeFile } = require("fs/promises");

const seederBaseFolder = join(__dirname, "../", "database");
const ITEMS_AMOUNT = 2;

const carCategory = new CarCategory({
  id: faker.string.uuid(),
  name: faker.vehicle.type(),
  cardIds: [],
  price: Number(faker.finance.amount({ min: 20, max: 100 })),
});

const cars = [];
const customers = [];
for (let index = 0; index < ITEMS_AMOUNT; index++) {
  const car = new Car({
    id: faker.string.uuid(),
    name: faker.vehicle.model(),
    available: true,
    gasAvailable: true,
    releaseYear: faker.date.past().getFullYear(),
  });

  carCategory.cardIds.push(car.id);
  cars.push(car);

  const customer = new Customer({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    age: faker.number.int({ min: 18, max: 50 }),
  });
  customers.push(customer);
}
console.log(join(seederBaseFolder));
const write = (filename, data) =>
  writeFile(join(seederBaseFolder, filename), JSON.stringify(data));
(async () => {
  await write("cars.json", cars);
  await write("customers.json", customers);
  await write("carCategory.json", [carCategory]);

  console.log("cars", cars);
  console.log("customers", customers);
  console.log("carCategory", carCategory);
})();