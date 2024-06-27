import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["coverage/", "lib/", "dist"]
  },
  {
    rules: {
      "@typescript-eslint/no-var-requires": "off"
    }
  }
];
