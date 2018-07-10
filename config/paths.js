'use strict';

const fs = require('fs');
const path = require('path');
// Make sure any symlinks in the project folder are resolved:
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  appDist: resolveApp('dist'),
  appPublic: resolveApp('public'),
  appSrc: resolveApp('src'),
  appPackageJson: resolveApp('package.json'),
  appTsConfig: resolveApp('tsconfig.dev.json'),
  appTsProdConfig: resolveApp('tsconfig.prod.json'),
  appTsLint: resolveApp('tslint.json'),
};
