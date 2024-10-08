const webpackConfig = require("./webpack.config");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = function (config) {
  config.set({
    frameworks: ["detectBrowsers", "mocha"],
    files: [
      "test/webtoken.spec.ts"
      // "test/testnet.spec.ts",
    ],
    preprocessors: {
      // don't use browserify, because it don't support dynamic require.
      // and some file is dynamic required in the `stm-lib` package.
      "test/*.spec.ts": ["webpack"]
    },
    singleRun: true,
    browserDisconnectTimeout: 60000,
    browserDisconnectTolerance: 3,
    client: {
      mocha: {
        timeout: 30000 // 6 seconds - upped from 2 seconds
      }
    },
    plugins: [
      "karma-webpack",
      "karma-chrome-launcher",
      "karma-env-preprocessor",
      "karma-firefox-launcher",
      "karma-detect-browsers",
      "karma-mocha"
    ],
    webpack: {
      node: webpackConfig.node,
      resolve: webpackConfig.resolve,
      module: webpackConfig.module,
      mode: "development",
      output: {
        path: path.join(__dirname, "temp")
      },
      plugins: [
        new NodePolyfillPlugin(),
        new webpack.IgnorePlugin({
          resourceRegExp: /canvas/,
          contextRegExp: /jsdom$/
        })
      ]
    },
    detectBrowsers: {
      enabled: true,
      usePhantomJS: false,
      postDetection(availableBrowser) {
        if (availableBrowser.includes("Chrome")) {
          return ["ChromeHeadless"];
        }

        var browsers = ["Chrome", "Firefox"];
        return browsers.filter(function (browser) {
          return availableBrowser.indexOf(browser) !== -1;
        });
      }
    }
  });
};
