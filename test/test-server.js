'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const { app, runServer, closeServer } = require('../server');


chai.use(chaiHttp);

function seedData() {
  console.info('Seeding data');
}

describe('Hacker News API', function () {
  this.timeout(15000);
  before(function () {
    return runServer();
  });

  beforeEach(function () {

  });

  afterEach(function () {

  });

  after(function () {
    return closeServer();
  });

  describe('Starter Test Suite', function () {
    this.timeout(15000);
    it('should be true', function () {
      true.should.be.true;
    });
  });

});