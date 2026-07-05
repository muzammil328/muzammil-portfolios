import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextVitals,

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "coverage/**",
      "node_modules/**",
    ],
  },

  {
    rules: {
      // JavaScript
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "error",

      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",

      // Next.js
      "@next/next/no-img-element": "warn",

      // General
      "no-var": "error",
      eqeqeq: ["error", "always"],
    },
  },
]);