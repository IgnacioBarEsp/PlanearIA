// Fixture: el registro crecio. Ambas entradas estan vivas, asi que el unico
// hallazgo posible es el techo: prueba el trinquete de forma aislada.
module.exports = {
  overrides: [
    {
      files: ["con-colors.sample.tsx", "otra-con-colors.sample.tsx"],
      rules: { "no-restricted-imports": "off" },
    },
  ],
};
