var assert = require('assert')
var Promise = require('bluebird')
require('../')

describe('bluebird_ext', function () {
  describe('exec', function  () {
    
    it('should exec Function success', function () {
      
      return Promise.exec(function () {
        return 1
      })
      .then(function (result) {
        assert.equal(result, 1)
      })
    })

    it('should exec Promise success', function () {
      
      return Promise
      .exec(Promise.delay(10).then(function () {
        return 1
      }))
      .then(function (result) {
        assert.equal(result, 1)
      })
    })

    it('should exec normal value success', function () {
      
      return Promise
      .exec(1)
      .then(function (result) {
        assert.equal(result, 1)
      })
    })

    it('should exec thenable object success', function () {

      return Promise
      .exec(global.Promise.resolve(1))
      .then(function (result) {
        assert.equal(result, 1)
      })
    })
  })
  
  describe('while', function () {

    it('should run while success', function () {
        
      var done = 0, loop = 100
      var condPromise = function () { 
        return done < loop 
      }
      var loopPromise = function () {
        return Promise.delay(1).then(function () {
          done ++
        })
      }
      return Promise
        .while(condPromise, loopPromise)
        .then(function () {
          assert.equal(done, loop)
        })
    })
  })

  describe('cargo', function () {

    it('should run cargo success', function () {
        
      var plist = new Array(100).fill(0).map(function () {
        return Promise.delay(1).then(function () {
          return 1
        })
      })
      var load = 9
      var callback = function (err, result) {
        assert.equal(err, null)
        assert.equal(result, 1)
      }
      return Promise.cargo(plist, load, callback)
    })

    it('should run cargo failed', function () {
        
      var plist = new Array(100).fill(0).map(function () {
        return Promise.delay(1).then(function () {
          throw new Error('unittest')
        })
      })
      var load = 9
      var callback = function (err) {
        assert.ok(err instanceof Error)
      }
      return Promise.cargo(plist, load, callback)
    })
  })
})