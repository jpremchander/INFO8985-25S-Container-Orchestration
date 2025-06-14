import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: "latest", // Enable modern JavaScript features
      sourceType: "module", // Use ES Modules
      globals: globals.browser, // Include browser globals like `window` and `document`
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // Include JavaScript recommended rules
      ...pluginReact.configs.flat.recommended.rules, // Include React recommended rules
      "react/react-in-jsx-scope": "off", // Disable React in scope for JSX
      "no-unused-vars": "warn", // Warn about unused variables
    },
  },
];
