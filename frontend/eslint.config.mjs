import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

// eslint-disable-next-line import/no-anonymous-default-export
export default [{
    ignores: ["**/node_modules/", "**/.next/", "**/out/"],
}, ...compat.extends("next", "prettier", "plugin:tailwindcss/recommended"), {
    rules: {
        "import/prefer-default-export": "off",
        "tailwindcss/no-custom-classname": "off",
        "react-hooks/exhaustive-deps": "off",
        "no-console": "off",
        "no-var": "error",
        "no-html-link-for-pages": "off",
    },
}];