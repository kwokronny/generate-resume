module.exports = {
  productionSourceMap: false,
  lintOnSave: false,
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      Object.assign(config, {
        externals: {
          vue: "Vue",
          "vuedraggable": "vuedraggable",
          "element-ui": {
            root: "ELEMENT",
            commonjs: "element-ui",
            commonjs2: "element-ui",
            amd: "element-ui",
          },
          "element-ui-saas-extend": "ElementUISaaSExtend",
        },
      });
    }
  },
};
