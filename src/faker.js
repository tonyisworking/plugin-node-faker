'use strict'
const faker = require('faker')

const log = require('@pattern-lab/core/src/lib/log')
const events = require('@pattern-lab/core/src/lib/events')

/**
 * @param {object} data
 */
function convertFakerData (data) {
  // Convert data to JSON string and process. Then, return it to an object.
  var stringData = JSON.stringify(data, (key, value) => {
    // find all the fakers
    if (typeof value === 'string') {
      return value.replace(/@faker\.[a-z]+\.[a-z][a-zA-Z]+(\([^)]*\))?@/g, (match) => {
        var dot = match.indexOf('.', 8)
        var brace = match.indexOf('(')
        var end = match.length - 1
        var fakerObject = match.slice(7, dot)
        var fakerFunction = match.slice(dot + 1, brace >= 0 ? brace : end)
        var fakerOptions = []
        if (brace >= 0) {
          fakerOptions = JSON.parse('[' + match.slice(brace + 1, end - 1) + ']')
        }
        try {
          const result = faker[fakerObject][fakerFunction].apply(faker[fakerObject], fakerOptions)
          log.debug(`'${match}' replaced with ${result}`)
          return result
        } catch (e) {
          log.warning(`'${match}' could not be processed: `, e)
          return match
        }
      })
    }
    return value
  })
  return JSON.parse(stringData)
}

function addMainFakerData (patternlab) {
  patternlab.data = convertFakerData(patternlab.data)
  patternlab.listitems = convertFakerData(patternlab.listitems)
}

function addPatternFakerData (args) {
  const pattern = args[1]

  log.debug(`called: addPatternFakerData(${JSON.stringify(arguments)})`)
  // Tried changing listitems here, but it doesn't want to appear in patterns at this event.
  // Probably tarketing wrong object data.
  // More research later. For now, two separate events.
  if (typeof pattern === 'object') {
    if (!pattern.jsonFileData) {
      pattern.jsonFileData = {}
    }
    pattern.jsonFileData = convertFakerData(pattern.jsonFileData)
  }
}

module.exports = {
/**
 * Define what events you wish to listen to here
 * For a full list of events - check out https://github.com/pattern-lab/patternlab-node/wiki/Creating-Plugins#events
 * @param {Patternlab} patternlab - global data store which has the handle to the event emitter
   */
  registerEvents (patternlab) {
  // register our handler at the appropriate time of execution
    patternlab.events.on(events.PATTERNLAB_BUILD_GLOBAL_DATA_END, addMainFakerData)
    patternlab.events.on(events.PATTERNLAB_PATTERN_BEFORE_DATA_MERGE, addPatternFakerData)
  }
}
