define(['exports', './aurelia-loader-systemjs'], function (exports, _aureliaLoaderSystemjs) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_aureliaLoaderSystemjs).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _aureliaLoaderSystemjs[key];
      }
    });
  });
});