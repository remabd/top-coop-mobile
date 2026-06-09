// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintConfigPrettier = require("eslint-config-prettier/flat");

module.exports = defineConfig([
  expoConfig,
  // Turn off ESLint rules that conflict with Prettier.
  // Prettier remains the single source of truth for formatting; ESLint only lints.
  eslintConfigPrettier,
  {
    ignores: ["dist/*"],
  },
]);
