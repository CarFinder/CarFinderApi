import chai = require('chai');
import chaiHttp = require('chai-http');
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import * as passport from 'koa-passport';
import * as mongoose from 'mongoose';
import User from '../src/db/schemas/user';

const should = chai.should();
chai.use(chaiHttp);

import { db } from '../src/config/config';
import router from '../src/routes/index';

describe('', () => {
  let app: any;
  const server = new Koa();
  beforeEach(done => {
    mongoose.connect(db, { useMongoClient: true });
    mongoose.set('debug', true);

    server.use(bodyParser());
    server.use(passport.initialize());
    server.use(logger());

    server.use(router.routes());

    app = server.listen(3004);
    done();
  });

  describe('user register request', () => {
    it('should be succes if users email is not used yet', done => {
      chai
        .request(app)
        .post('/user/register')
        .set('content-type', 'application/json')
        .send({
          confirmed: false,
          email: 'vasya_pupkin@mail.com',
          image: 'lint to s3',
          interfaceLang: 'en',
          name: 'Ivan',
          password: 'Real Man',
          subscription: false
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('should be failt if user with this email is exist', done => {
      chai
        .request(app)
        .post('/user/register')
        .set('content-type', 'application/json')
        .send({ test: 'test' })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    afterEach(done => {
      app.close();
      done();
    });
  });
});
