import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const plugins = {
  "eslint-plugin": eslint,
  "@typescript-eslint": tseslint,
};

const languageOptions = {
  parserOptions: {
    projectService: true,
    tsconfigRootDir: import.meta.dirname,
  }
};

const baseRules = {};

export default [
  {
    plugins,
    languageOptions,
    rules: baseRules
  }
];