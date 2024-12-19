const http = require("http");
const { once } = require("events");

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

const DEFAULT_PORT = 3000;

const CarService = require("./service/carService");

const dependenciesFactory = () => ({
  carService: new CarService({ cars: require("../database/cars.json") }),
});

class Api {
  constructor(depenpencies = dependenciesFactory()) {
    this.carService = depenpencies.carService;
  }

  generateRoutes() {
    return {
      "/available-car:post": async (request, response) => {
        try {
          const carCategory = JSON.parse(await once(request, "data"));
          const result = await this.carService.getAvailableCar(carCategory);
          response.writeHead(200, DEFAULT_HEADERS);
          response.write(JSON.stringify({ result }));
          return response.end();
        } catch (error) {
          response.writeHead(500, DEFAULT_HEADERS);
          response.write(
            JSON.stringify({ error: "Sistema com erro inesperado." })
          );
          return response.end();
        }
      },
      "/calculate-final-price:post": async (request, response) => {
        try {
          const body = JSON.parse(await once(request, "data"));
          const { customer, carCategory, numberOfDays } = body;
          const result = this.carService.calculateFinalPrice(
            customer,
            carCategory,
            numberOfDays
          );
          response.writeHead(200, DEFAULT_HEADERS);
          response.write(JSON.stringify({ result }));
          return response.end();
        } catch (error) {
          response.writeHead(500, DEFAULT_HEADERS);
          response.write(
            JSON.stringify({ error: "Sistema com erro inesperado." })
          );
          return response.end();
        }
      },
      "/rent:post": async (request, response) => {
        try {
          const body = JSON.parse(await once(request, "data"));
          const { customer, carCategory, numberOfDays } = body;
          const result = await this.carService.rent(
            customer,
            carCategory,
            numberOfDays
          );
          response.writeHead(200, DEFAULT_HEADERS);
          response.write(JSON.stringify({ result }));
          return response.end();
        } catch (error) {
          response.writeHead(500, DEFAULT_HEADERS);
          response.write(
            JSON.stringify({ error: "Sistema com erro inesperado." })
          );
          return response.end();
        }
      },
      default(request, response) {
        const { url, method } = request;
        response.writeHead(404, DEFAULT_HEADERS);
        response.write(JSON.stringify({ error: "Not Found" }));
        return response.end();
      },
    };
  }

  generatedHandler(request, response) {
    const { url, method } = request;

    response.writeHead(200, DEFAULT_HEADERS);
    const routes = this.generateRoutes();
    const routeKey = `${url.toLowerCase()}:${method.toLowerCase()}`;
    const chosen = routes[routeKey] || routes.default;
    return chosen(request, response);
  }

  initialize(port = DEFAULT_PORT) {
    const app = http
      .createServer(this.generatedHandler.bind(this))
      .listen(port, () => console.log("running at 3000"));
    return app;
  }
}

module.exports = (depenpencies) => new Api(depenpencies);
