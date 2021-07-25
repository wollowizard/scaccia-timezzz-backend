import * as express from "express";
import cityService from "./city-service";

class CityController {
  public readonly router = express.Router();

  constructor() {
    this.router.get(`/`, this.getCities);
  }

  getCities = async (request: express.Request, response: express.Response) => {
    const {city, country} = request.query as any;
    return response.json(cityService.getCities(city, country));
  }
}

const cityController = new CityController()
export default cityController;
