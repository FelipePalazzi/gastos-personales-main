module.exports =  function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo',
    ['@babel/preset-react', { runtime: 'automatic' }]],
    plugins: [
      ['module:react-native-dotenv', {
        "moduleName": "@env",
        "path": ".env",
        "blacklist": null,
        "whitelist": null,
        "safe": false,
        "allowUndefined": true
      }]
    ]
  };
};
