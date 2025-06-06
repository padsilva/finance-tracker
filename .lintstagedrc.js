import { relative } from "path";

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => relative(process.cwd(), f))
    .join(" --file ")}`;

export default {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand, "prettier --write"],
  "*.{json,md}": ["prettier --write"],
  "*.{ts,tsx}": () => "tsc --noEmit",
};
