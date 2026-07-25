// Fixture: el registro conserva una entrada de una pantalla ya migrada.
module.exports = {
  overrides: [
    {
      files: ["con-colors.sample.tsx", "sin-colors.sample.tsx"],
      rules: { "no-restricted-imports": "off" },
    },
  ],
};
