module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@assets": "./assets",
            '@constants': "./constants",
            '@hooks': "./hooks",
            '@redux': "./redux",
            '@screens': "./screens",
            '@shared': "./shared",
            '@utils': "./utils",
          },
        },
      ],
    ],
  };
};
