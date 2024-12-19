const { describe, it, after, before } = require("mocha");
const CarService = require("../../src/service/carService");
const supertest = require("supertest");
const sinon = require("sinon");
const path = require("path");
const { expect } = require("chai");
const DEFAULT_PORT = 4000;

const mocks = {
  validCarCategory: require("../mocks/valid-carCategory.json"),
  validCar: require("../mocks/valid-car.json"),
  validCustomer: require("../mocks/valid-customer.json"),
};

const deepValues = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(deepValues).sort();
  }
  return Object.keys(obj)
    .sort()
    .map((key) => deepValues(obj[key]));
};

describe("API Suite Testes", () => {
  let app = {};
  let sandbox = {};
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  before(() => {
    const api = require("../../src/api");
    const carsDatabase = path.resolve(
      path.join(__dirname, "./../../database", "cars.json")
    );
    const carService = new CarService({ cars: carsDatabase });
    const instance = api({ carService });
    app = {
      instance,
      server: instance.initialize(DEFAULT_PORT),
    };
  });

  describe("/available-car:post", () => {
    it("given a carCategory it should return an available car", async () => {
      const car = mocks.validCar;
      const carCategory = Object.create(mocks.validCarCategory);
      carCategory.carIds = [car.id];

      const expected = {
        result: car,
      };

      const response = await supertest(app.server)
        .post("/available-car")
        .send(carCategory)
        .expect(200);
      expect(response.body).to.be.deep.equal(expected);
    });
  });

  describe("/calculate-final-price:post", () => {
    it("given a carCategory, customer and numberOfDays it should calculate final amount in real", async () => {
      const customer = Object.create(mocks.validCustomer);
      customer.age = 50;

      const carCategory = Object.create(mocks.validCarCategory);
      carCategory.price = 37.6;

      const numberOfDays = 5;

      const expected = {
        result: app.instance.carService.currencyFormat.format(244.4),
      };

      const body = {
        customer,
        carCategory,
        numberOfDays,
      };

      const response = await supertest(app.server)
        .post("/calculate-final-price")
        .send(body)
        .expect(200);

      expect(response.body).to.be.deep.equal(expected);
    });
  });

  describe("/rent:post", () => {
    it("given a customer and a car category it should return a transaction receipt", async () => {
      const car = mocks.validCar;
      const carCategory = {
        ...mocks.validCarCategory,
        price: 37.6,
        carIds: [car.id],
      };

      const customer = Object.create(mocks.validCustomer);
      customer.age = 20;

      const numberOfDays = 5;

      const body = {
        customer,
        carCategory,
        numberOfDays,
      };

      const expectedAmount =
        app.instance.carService.currencyFormat.format(206.8);
      const today = new Date();
      today.setDate(today.getDate() + numberOfDays);
      const options = { year: "numeric", month: "long", day: "numeric" };
      const dueDate = today.toLocaleDateString("pt-br", options);

      const expected = {
        result: {
          customer,
          car,
          amount: expectedAmount,
          dueDate,
        },
      };

      const response = await supertest(app.server)
        .post("/rent")
        .send(body)
        .expect(200);

      const keys = (obj) => Object.keys(obj);
      expect(keys(response.body)).to.be.deep.equal(keys(expected));
      expect(deepValues(response.body)).to.be.deep.equal(deepValues(expected));
      expect(response.body.result.dueDate).to.be.not.empty;
      expect(response.body.result.amount).to.be.not.empty;
    });
  });
});
