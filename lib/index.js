var Promise = require('bluebird')

Promise.exec = Promise.prototype.exec = function (value) {
  
  if(value instanceof Function) {
    return Promise.try(value)
  } 
  return Promise.resolve(value)
}

Promise.while = function (condPromise, loopPromise) {
  
  return Promise
    .exec(condPromise)
    .then(function (result) {
      if(result) {
        return Promise
          .exec(loopPromise)
          .then(function () { return Promise.while(condPromise, loopPromise) })
      }
    })   
}

var noop = function() {}

Promise.cargo = function (plist, load, callback) {

  plist = plist || []
  load = load || 1
  callback = callback || noop

  return Promise.while(
    function() { return plist.length > 0 },
    function() {
      var loadlist = plist.splice(0, load)
      var real_load = Math.min(load, loadlist.length)
      return Promise.map(new Array(real_load).fill(0), function (elem, idx) {
        return Promise.exec(loadlist[idx]).asCallback(callback).catch(noop)
      })
    }
  )
}
