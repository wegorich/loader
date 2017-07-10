import {
  Origin
} from 'aurelia-metadata';
import {
  Loader
} from 'aurelia-loader';
import {
  DOM,
  PLATFORM
} from 'aurelia-pal';

/*eslint dot-notation:0*/
/**
 * An implementation of the TemplateLoader interface implemented with text-based loading.
 */
export declare class TextTemplateLoader {
  
  /**
     * Loads a template.
     * @param loader The loader that is requesting the template load.
     * @param entry The TemplateRegistryEntry to load and populate with a template.
     * @return A promise which resolves when the TemplateRegistryEntry is loaded with a template.
     */
  loadTemplate(loader?: any, entry?: any): any;
}
export declare function ensureOriginOnExports(moduleExports?: any, moduleId?: any): any;
export declare function getLoader(): any;

/**
 * A default implementation of the Loader abstraction which works with SystemJS, RequireJS and Dojo Loader.
 */
export declare class SystemJSLoader extends Loader {
  moduleRegistry: any;
  loaderPlugins: any;
  modulesBeingLoaded: any;
  templateLoader: any;
  hmrContext: any;
  
  /**
     * Creates an instance of the SystemJSLoader.
     */
  constructor();
  
  /**
     * Maps a module id to a source.
     * @param id The module id.
     * @param source The source to map the module to.
     */
  map(id?: any, source?: any): any;
  
  /**
     * Normalizes a module id.
     * @param moduleId The module id to normalize.
     * @param relativeTo What the module id should be normalized relative to.
     * @return The normalized module id.
     */
  normalizeSync(moduleId?: any, relativeTo?: any): any;
  
  /**
     * Normalizes a module id.
     * @param moduleId The module id to normalize.
     * @param relativeTo What the module id should be normalized relative to.
     * @return The normalized module id.
     */
  normalize(moduleId?: any, relativeTo?: any): any;
  
  /**
     * Instructs the loader to use a specific TemplateLoader instance for loading templates
     * @param templateLoader The instance of TemplateLoader to use for loading templates.
     */
  useTemplateLoader(templateLoader?: any): any;
  
  /**
     * Loads a collection of modules.
     * @param ids The set of module ids to load.
     * @return A Promise for an array of loaded modules.
     */
  loadAllModules(ids?: any): any;
  
  /**
     * Loads a module.
     * @param moduleId The module ID to load.
     * @return A Promise for the loaded module.
     */
  loadModule(moduleId?: any, defaultHMR?: any, forse?: any): any;
  
  /**
     * Loads a text-based resource.
     * @param url The url of the text file to load.
     * @return A Promise for text content.
     */
  loadText(url?: any): any;
  
  /**
     * Loads a template.
     * @param url The url of the template to load.
     * @return A Promise for a TemplateRegistryEntry containing the template.
     */
  loadTemplate(url?: any): any;
  
  /**
     * Alters a module id so that it includes a plugin loader.
     * @param url The url of the module to load.
     * @param pluginName The plugin to apply to the module id.
     * @return The plugin-based module id.
     */
  applyPluginToUrl(url?: any, pluginName?: any): any;
  
  /**
     * Registers a plugin with the loader.
     * @param pluginName The name of the plugin.
     * @param implementation The plugin implementation.
     */
  addPlugin(pluginName?: any, implementation?: any): any;
}