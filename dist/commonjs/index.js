'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaLoaderSystemjs = require('./aurelia-loader-systemjs');

Object.keys(_aureliaLoaderSystemjs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _aureliaLoaderSystemjs[key];
    }
  });
});