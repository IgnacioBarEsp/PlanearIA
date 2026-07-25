// Fixture: no hay ningun override que apague la restriccion, asi que el
// registro no se puede leer. La guardia debe fallar de forma explicita en vez
// de pasar sin comprobar nada.
module.exports = {
  overrides: [
    {
      files: ["restringe/todo.tsx"],
      rules: { "no-restricted-imports": ["error", { patterns: [] }] },
    },
  ],
};
