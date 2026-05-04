const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

module.exports = (() => {
  // 1. Obtém a configuração padrão do Expo
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  // 2. Adiciona o transformador de SVG
  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };

  // 3. Ajusta o resolver para ignorar o .svg como asset e tratá-lo como código fonte
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

  // 4. Exporta a configuração final envolvida pelo withNativeWind
  return withNativeWind(config, { input: "./global.css" });
})();