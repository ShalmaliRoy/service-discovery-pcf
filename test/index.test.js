const chai = require('chai');
const sinon = require('sinon');
const serviceDiscovery = require('../src/discover-service-pcf');
const MiddleWare = require('../src/index.js');
const run = require('express-unit');

const expect = chai.expect;
const sandbox = sinon.sandbox.create();

const options = { domain: 'mockUrl', name: '*', password: '*' };
const pins = [{ pin: 'role:test' }];

describe('MiddleWare test', () => {
  let serviceDiscoveryStub;

  function setupServiceStubs() {
    serviceDiscoveryStub.discover = sandbox.stub(serviceDiscovery, 'discover');
  }


  beforeEach(() => {
    serviceDiscoveryStub = sandbox.stub(serviceDiscovery, 'serviceDiscovery');
    setupServiceStubs();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return a map with matching services for a pattern', (done) => {
    const map = new Map();
    map.set('role:test', 'test.cfapps.io');
    const middleWare = new MiddleWare(options);

    const stub = serviceDiscoveryStub.discover.yields([pins, options], map).returns(map);
    const callback = sinon.spy();
    const response = stub(callback);
    expect(response).to.be.a('Map');
    run(null, middleWare.find(pins), done);
  });
  it('should return a map with matching services for a pattern even when options are not provided and read from manifest file instead', (done) => {
    const map = new Map();
    map.set('role:test', 'test.cfapps.io');
    const middleWare = new MiddleWare();

    const stub = serviceDiscoveryStub.discover.yields([pins, null], map).returns(map);
    const callback = sinon.spy();
    const response = stub(callback);
    expect(response).to.be.a('Map');
    run(null, middleWare.find(pins), done);
  });
});
describe('MiddleWare exception test', () => {
  let serviceDiscoveryStub;

  function setupServiceStubs() {
    serviceDiscoveryStub.discover = sandbox.stub(serviceDiscovery, 'discover');
  }


  beforeEach(() => {
    serviceDiscoveryStub = sandbox.stub(serviceDiscovery, 'serviceDiscovery');
    setupServiceStubs();
  });

  afterEach(() => {
    sandbox.restore();
  });
  it('should return an error  when cannot connect to cloud foundry or services not found', (done) => {
    const error = new Error('getaddrinfo ENOTFOUND mockUrl:443');
    const middleWare = new MiddleWare(options);
    const stub = serviceDiscoveryStub.discover.yields(error).returns(error);
    const callback = sinon.spy();
    const err = stub(callback);
    expect(err).to.be.instanceOf(Error);
    run(null, middleWare.find(pins), done);
  });

  it('should return an error  when pin not an array', (done) => {
    const middleWare = new MiddleWare(options);
    run(null, middleWare.find({ pin: 'role:test' }), (err) => {
      expect(err).to.be.instanceOf(Error);
      done();
    });
  });

  it('should return an error  when pin not in seneca specific format ', (done) => {
    const middleWare = new MiddleWare(options);
    run(null, middleWare.find([{ pin: 'test' }]), (err) => {
      expect(err).to.be.instanceOf(Error);
      done();
    });
  });

  it('should return an error  when pattern is null or pin identifier missing ', (done) => {
    const middleWare = new MiddleWare(options);
    run(null, middleWare.find([{ pin: 'role:test' }, {}]), (err) => {
      expect(err).to.be.instanceOf(Error);
      done();
    });
  });
});
