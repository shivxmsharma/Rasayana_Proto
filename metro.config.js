const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Platform-specific module resolution
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add platform extensions
config.resolver.sourceExts.push('web.js', 'web.ts', 'web.tsx');

module.exports = config;
