import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    ignores: ["node_modules/**", ".next/**", ".history/**", "next-env.d.ts"],
  },
  {
    // React Compiler strictness rules flag the app's hydrate-from-localStorage
    // pattern and vendored shadcn components; surface them without failing lint.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
    },
  },
]);

export default eslintConfig;
