// Fixture: el registro conserva una entrada de un archivo borrado.
module.exports = {
  overrides: [
    {
      files: ["con-colors.sample.tsx", "pantalla-borrada.sample.tsx"],
      rules: { "no-restricted-imports": "off" },
    },
  ],
};
