export default {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' }, modules: false }], // Preserve ESM
  ],
  plugins: [
    'babel-plugin-transform-import-meta', // Handle import.meta
  ],
};