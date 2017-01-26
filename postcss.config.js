'use strict';

module.exports = {
  sourceMap: "inline",
  plugins: [
    require("autoprefixer")({browsers: ["last 5 versions"]}),
    require("postcss-pxtorem")({rootValue: 16, replace: false})
  ]
};
