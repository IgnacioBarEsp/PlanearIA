// Fixture: registro sano. Una entrada, viva, dentro del techo.
module.exports = {
  overrides: [
    {
      files: ["restringe/todo/lo/demas.tsx"],
      rules: { "no-restricted-imports": ["error", { patterns: [] }] },
    },
    {
      files: ["con-colors.sample.tsx"],
      rules: { "no-restricted-imports": "off" },
    },
  ],
};
