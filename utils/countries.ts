import { countries } from "countries-list";

export const countryList = Object.entries(countries)
  .map(([code, { name }]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name));
