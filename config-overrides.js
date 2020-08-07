const {
  addLessLoader,
  override,
  fixBabelImports,
  addDecoratorsLegacy,
} = require('customize-cra')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      modifyVars: { '@primary-color': '#75517d' },
      javascriptEnabled: true,
    },
  }),
  addDecoratorsLegacy()
)
