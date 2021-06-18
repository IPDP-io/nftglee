module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.{js,svelte}',
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F4E79",
        secondary: "#121212",
      } 
    } 
  },
};
