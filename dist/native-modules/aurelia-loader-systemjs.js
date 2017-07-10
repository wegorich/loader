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

let TextTemplateLoader = exports.TextTemplateLoader = class TextTemplateLoader {
  async loadTemplate(loader, entry) {
    const text = await loader.loadText(entry.address);
    entry.template = _aureliaPal.DOM.createTemplateFromMarkup(text);
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
    super();

    this.moduleRegistry = Object.create(null);
    this.loaderPlugins = {};
    this.modulesBeingLoaded = new Map();

    this.textPluginName = 'text';

    this.moduleRegistry = Object.create(null);
    this.useTemplateLoader(new TextTemplateLoader());

    loader = this;

    this.addPlugin('template-registry-entry', {
      fetch: async (address, _loader) => {
        const entry = this.getOrCreateTemplateRegistryEntry(address);
        if (!entry.templateIsLoaded) {
          await this.templateLoader.loadTemplate(this, entry);
        }
        return entry;
      }
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

  async _import(address, defaultHMR = true) {
    const addressParts = address.split('!');
    const moduleId = addressParts[0];
    const loaderPlugin = addressParts.length > 1 ? addressParts[1] : null;

    if (loaderPlugin) {
      const plugin = this.loaderPlugins[loaderPlugin];
      if (!plugin) {
        throw new Error(`Plugin ${loaderPlugin} is not registered in the loader.`);
      }
      if (plugin.hot) {
        plugin.hot(moduleId);
      }
      return await plugin.fetch(moduleId);
    }

    return SystemJS.import(moduleId.endsWith('.html') ? address + '!text' : moduleId);
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

  async loadModule(moduleId, defaultHMR = true, forse) {
    let existing = this.moduleRegistry[moduleId];
    if (existing) {
      return Promise.resolve(existing);
    }
    let beingLoaded = this.modulesBeingLoaded.get(moduleId);
    if (beingLoaded) {
      return Promise.resolve(beingLoaded);
    }
    beingLoaded = this._import(moduleId, defaultHMR);
    this.modulesBeingLoaded.set(moduleId, beingLoaded);

    const moduleExports = await beingLoaded;
    this.moduleRegistry[moduleId] = ensureOriginOnExports(moduleExports, moduleId);
    this.modulesBeingLoaded.delete(moduleId);
    return moduleExports;
  }

  async loadText(url) {
    const result = await this.loadModule(url, false);
    if (result instanceof Array && result[0] instanceof Array && result.hasOwnProperty('toString')) {
      return result.toString();
    }
    return result;
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