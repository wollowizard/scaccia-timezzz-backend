import cityTimezones, { CityData } from "city-timezones"

class CityService {

  // @ts-ignore
  cities: CityData[] = cityTimezones.cityMapping

  getCities = (city: string | undefined, country: string | undefined) => {
    let results = this.cities;
    if (city?.length) {
      results = results.filter(e => e.city_ascii.toLowerCase().includes(city.toLowerCase()));
    }
    if (country?.length) {
      results = results.filter(e => e.country.toLowerCase().includes(country.toLowerCase()));
    }
    return results;
  }
}

const cityService = new CityService();
export default cityService;
