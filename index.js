'use strict'
const packageJson = require('./package.json')

const log = require('@pattern-lab/core/src/lib/log')

const pluginName = packageJson['@pattern-lab-plugin'].name
const pluginModuleName = packageJson.name

const pluginFaker = require('./src/faker')

/**
* A single place to define the frontend configuration
* This configuration is outputted to the frontend explicitly as well as included in the plugins object.
*
*/
function getPluginFrontendConfig () {
  return {
    name: pluginName,
    templates: [],
    stylesheets: [],
    javascripts: [],
    onready: '',
    callback: ''
  }
}

/**
* The entry point for the plugin. You should not have to alter this code much under many circumstances.
* Instead, alter getPluginFrontendConfig() and registerEvents() methods
  */
function pluginInit (patternlab) {
  if (!patternlab) {
    console.error('patternlab object not provided to plugin-init')
    process.exit(1)
  }

  // write the plugin json to public/patternlab-components
  var pluginConfig = getPluginFrontendConfig()

  // add the plugin config to the patternlab-object
  if (!patternlab.plugins) {
    patternlab.plugins = []
  }
  patternlab.plugins.push(pluginConfig)

  // setup listeners if not already active. we also enable and set the plugin as initialized
  if (!patternlab.config.plugins) {
    patternlab.config.plugins = {}
  }

  // attempt to only register events once
  if (patternlab.config.plugins[pluginModuleName] !== undefined &&
     patternlab.config.plugins[pluginModuleName].enabled &&
     !patternlab.config.plugins[pluginModuleName].initialized) {
    // register events
    pluginFaker.registerEvents(patternlab)

    // set the plugin initialized flag to true to indicate it is installed and ready
    patternlab.config.plugins[pluginModuleName].initialized = true
    log.info(`${pluginName} as ${pluginModuleName} loaded`)
  }
}

module.exports = pluginInit
