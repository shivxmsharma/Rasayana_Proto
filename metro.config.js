const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    platforms: ['ios', 'android', 'native', 'web'],
    sourceExts: [...defaultConfig.resolver.sourceExts, 'web.js', 'web.ts', 'web.tsx'],
    assetExts: [...defaultConfig.resolver.assetExts, 'png', 'jpg', 'jpeg']
  }
};