'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SystemJSLoader = exports.TextTemplateLoader = undefined;
exports.ensureOriginOnExports = ensureOriginOnExports;
exports.getLoader = getLoader;

var _aureliaMetadata = require('aurelia-metadata');

var _aureliaLoader = require('aurelia-loader');

var _aureliaPal = require('aurelia-pal');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let TextTemplateLoader = exports.TextTemplateLoader = class TextTemplateLoader {
  loadTemplate(loader, entry) {
    return _asyncToGenerator(function* () {
      const text = yield loader.loadText(entry.address);
      entry.template = _aureliaPal.DOM.createTemplateFromMarkup(text);
    })();
  }
};
function ensureOriginOnExports(moduleExports, moduleId) {
  let target = moduleExports;
  let key;
  let exportedValue;

  if (target.__useDefault) {
    target = target.default;
  }

  _aureliaMetadata.Origin.set(target, new _aureliaMetadata.Origin(moduleId, 'default'));

  if (typeof target === 'object') {
    for (key in target) {
      exportedValue = target[key];

      if (typeof exportedValue === 'function') {
        _aureliaMetadata.Origin.set(exportedValue, new _aureliaMetadata.Origin(moduleId, key));
      }
    }
  }

  return moduleExports;
}

let loader;

function getLoader() {
  return loader;
}

let SystemJSLoader = exports.SystemJSLoader = class SystemJSLoader extends _aureliaLoader.Loader {
  constructor() {
    var _this;

    _this = super();

    this.moduleRegistry = Object.create(null);
    this.loaderPlugins = {};
    this.modulesBeingLoaded = new Map();

    this.textPluginName = 'text';

    this.moduleRegistry = Object.create(null);
    this.useTemplateLoader(new TextTemplateLoader());

    loader = this;

    this.addPlugin('template-registry-entry', {
      fetch: (() => {
        var _ref = _asyncToGenerator(function* (address, _loader) {
          const entry = _this.getOrCreateTemplateRegistryEntry(address);
          if (!entry.templateIsLoaded) {
            yield _this.templateLoader.loadTemplate(_this, entry);
          }
          return entry;
        });

        return function fetch(_x, _x2) {
          return _ref.apply(this, arguments);
        };
      })()
    });

    _aureliaPal.PLATFORM.eachModule = function (callback) {
      if (System.registry) {
        for (let [k, m] of System.registry.entries()) {
          try {
            if (callback(k, m)) return;
          } catch (e) {}
        }
        return;
      }

      let modules = System._loader.modules;
      for (let key in modules) {
        try {
          if (callback(key, modules[key].module)) return;
        } catch (e) {}
      }
    };
  }

  _import(address, defaultHMR = true) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const addressParts = address.split('!');
      const moduleId = addressParts[0];
      const loaderPlugin = addressParts.length > 1 ? addressParts[1] : null;

      if (loaderPlugin) {
        const plugin = _this2.loaderPlugins[loaderPlugin];
        if (!plugin) {
          throw new Error(`Plugin ${loaderPlugin} is not registered in the loader.`);
        }
        if (plugin.hot) {
          plugin.hot(moduleId);
        }
        return yield plugin.fetch(moduleId);
      }

      return SystemJS.import(moduleId.endsWith('.html') ? address + '!text' : moduleId);
    })();
  }

  map(id, source) {}

  normalizeSync(moduleId, relativeTo) {
    return moduleId;
  }

  normalize(moduleId, relativeTo) {
    return Promise.resolve(moduleId);
  }

  useTemplateLoader(templateLoader) {
    this.templateLoader = templateLoader;
  }

  loadAllModules(ids) {
    return Promise.all(ids.map(id => this.loadModule(id)));
  }

  loadModule(moduleId, defaultHMR = true, forse) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      let existing = _this3.moduleRegistry[moduleId];
      if (existing) {
        return Promise.resolve(existing);
      }
      let beingLoaded = _this3.modulesBeingLoaded.get(moduleId);
      if (beingLoaded) {
        return Promise.resolve(beingLoaded);
      }
      beingLoaded = _this3._import(moduleId, defaultHMR);
      _this3.modulesBeingLoaded.set(moduleId, beingLoaded);

      const moduleExports = yield beingLoaded;
      _this3.moduleRegistry[moduleId] = ensureOriginOnExports(moduleExports, moduleId);
      _this3.modulesBeingLoaded.delete(moduleId);
      return moduleExports;
    })();
  }

  loadText(url) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const result = yield _this4.loadModule(url, false);
      if (result instanceof Array && result[0] instanceof Array && result.hasOwnProperty('toString')) {
        return result.toString();
      }
      return result;
    })();
  }

  loadTemplate(url) {
    return this.loadModule(this.applyPluginToUrl(url, 'template-registry-entry'), false);
  }

  applyPluginToUrl(url, pluginName) {
    return `${url}!${pluginName}`;
  }

  addPlugin(pluginName, implementation) {
    this.loaderPlugins[pluginName] = implementation;
  }
};


_aureliaPal.PLATFORM.Loader = SystemJSLoader;

System.set('text', System.newModule({
  'translate': function (load) {
    let exports = 'module.exports = "' + load.source.replace(/(["\\])/g, '\\$1').replace(/[\f]/g, '\\f').replace(/[\b]/g, '\\b').replace(/[\n]/g, '\\n').replace(/[\t]/g, '\\t').replace(/[\r]/g, '\\r').replace(/[\u2028]/g, '\\u2028').replace(/[\u2029]/g, '\\u2029') + '";';
    return exports;
  }
}));