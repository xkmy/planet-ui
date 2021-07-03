const outputModule = process.env.OUTPUT_MODULE

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: outputModule || false
      }
    ],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    '@babel/plugin-proposal-class-properties'
  ].filter(Boolean)
}
