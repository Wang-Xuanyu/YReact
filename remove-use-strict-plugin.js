class RemoveUseStrictPlugin {
  constructor(options) {
    this.options = options||{}
  }
  apply(compiler){
    compiler.hooks.compilation.tap("RemoveUseStrictPlugin", (compilation) => {
      compilation.hooks.processAssets.tap({
        name:'RemoveUseStrictPlugin',
        stage:compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
        additionalAssets:[],
      },(files)=>{
        if (files['bundle.js']) {
          console.log('-----------------------',files['bundle.js']);
          return files;

        }
      })
    });
  }
}

module.exports = RemoveUseStrictPlugin
