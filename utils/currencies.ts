import codes from "currency-codes";

export const currencyList = codes.data
  .map((currency) => ({
    code: currency.code,
    name: currency.currency,
  }))
  .sort((a, b) => a.code.localeCompare(b.code));
