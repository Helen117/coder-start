/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

var gulp = require('gulp');
var webpackStream = require('webpack-stream');
//var reload = require('./../gulp-hot-reload/src/index');
var reload = require('gulp-hot-reload');
var webpack = require('webpack');
var gutil = require('gulp-util');
var path = require('path');
var del = require("del");

var dist = {
  root: "dist/",
  assets: "dist/assets"
};

var src = {
  assets: "assets/**/*"
};

const buildDone = (err, stats) => {
  if(err) throw new gutil.PluginError("webpack", err);
  gutil.log('[webpack]', stats.toString({
    colors: true,
    chunkModules: false,
    assets: false,
    version: false,
    hash: false
  }))
}

var config = require('./webpack.config.js')
var prodConfig = require('./webpack.config.prod.js')
//var serverConfig = require('./webpack.server.config.js')

gulp.task('build', () => {
  gulp
    .src('./server.js')
    //.pipe(webpackStream(config, webpack, buildDone))
    .pipe(reload({
      port: 8080,
      react: true,
      config: path.join(__dirname, 'webpack.config.js')
    }))
})

gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['build'])
})


gulp.task('cleanDist', function () {
  del.sync(dist.root);
});

gulp.task('copyAssets',function () {
  return gulp.src(src.assets)
      .pipe(gulp.dest(dist.assets));
})

//打包
gulp.task('dist', ['cleanDist','copyAssets'], function () {
  process.env.NODE_ENV = 'production'
  gulp
    .src('./src/index.js')
    .pipe(webpackStream(prodConfig, webpack, buildDone))
    .pipe(gulp.dest('dist'))
})//等同与：webpack -p

//TODO，该task使用gulp-hot-reload实现热加载，但脚本还有点问题，暂时使用node server.js
gulp.task('default', ['build', 'watch'], function () {
  gutil.log('watch')
})
