module.exports = {
  env: {
    node: true, // Für Node.js-Umgebung
    es2021: true, // Moderne JavaScript-Features (ES12)
  },
  extends: [
    'airbnb-base', // Airbnb Styleguide für Vanilla JS (kein React)
    'plugin:prettier/recommended', // Prettier integrieren (Formatierung)
  ],
  parserOptions: {
    ecmaVersion: 'latest', // Neueste ECMAScript Version
    sourceType: 'module', // ECMAScript Module
  },
  plugins: ['import', 'prettier', 'node'],
  rules: {
    // Prettier-Fehler als ESLint Fehler anzeigen
    'prettier/prettier': ['error'],

    // Airbnb-Regeln, die du anpassen kannst:
    'no-console': 'off', // Erlaubt console.log
    'import/no-unresolved': 'off', // Manchmal Probleme bei Imports mit .js Endung

    // Beispiel: erlauben von Variablen ohne Verwendung (für Dev-Zwecke)
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    // Node-spezifische Regeln
    'node/no-unsupported-features/es-syntax': [
      'error',
      { ignores: ['modules'] },
    ],

    // Optional: max line length passt Prettier an, damit keine Konflikte entstehen
    'max-len': ['error', { code: 100 }],
  },
};
