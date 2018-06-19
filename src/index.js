/* eslint-disable no-shadow,consistent-return */
const serviceDiscovery = require('./discover-service-pcf');
const Cache = require('node-cache');

const cache = new Cache({ stdTTL: 1800, checkperiod: 600, useClones: false });
let opt = {};

/**
 * options ={domain,name,password of the cloudfoundry instance}
 * @param options
 */
function service(options) {
  if (options) {
    opt = options;
  }
}

/**
 * Creates a middleware and calls service discovery to locate services
 * @param pins
 * @param opt
 * @returns {function(pins, options, callback)}
 */
function createMiddleWare(pins, opt) {
  return (req, res, next) => {
    if (!pins || !(pins instanceof Array)) {
      return next(new Error('patterns must be an array'), null);
    }
    pins.forEach((pattern) => {
      if (pattern && pattern.pin) {
        const name = pattern.pin.split(':');
        if (name.length !== 2) {
          return next(new Error('Not a valid pattern. Valid formats role:service name or cmd:service name '));
        }
      } else {
        return next(new Error('Pattern or Pin identifier missing '));
      }
    });
    const cachedvalue = cache.get('services');
    if (cachedvalue) {
      req.clientUrl = cachedvalue;
      return next();
    }
    serviceDiscovery.discover(pins, opt, (err, response) => {
      if (response && response.size > 0) {
        req.clientUrl = response;
        cache.set('services', response, 1800);
        return next();
      }
      return next(err);
    });
  };
}

/**
 * The services to be located [{pin:'role:test'}]
 * @param pin
 * @returns {function(pins, options, callback)}
 */
service.prototype.find = function (pin) {
  return createMiddleWare(pin, opt);
};

module.exports = createMiddleWare;
module.exports = service;
