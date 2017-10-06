import chai = require('chai');
import chaiHttp = require('chai-http');
import { promisify } from 'util';
import { User } from '../src/db/index';
import app from './index';

const should = chai.should();
chai.use(chaiHttp);

describe('User Registartion', () => {
  
  afterEach(done => {
    User.remove({ email: 'pupkin@mail.com' }).then(done());
  });

  it('should be succes if users email is not used yet', done => {
    chai
      .request(app)
      .post('/user/register')
      .set('content-type', 'application/json')
      .send({
        confirmed: false,
        email: 'pupkin@mail.com',
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
    const test = () =>
      chai
        .request(app)
        .post('/user/register')
        .set('content-type', 'application/json')
        .send({
          confirmed: false,
          email: 'pupkin@mail.com',
          image: 'lint to s3',
          interfaceLang: 'en',
          name: 'Ivan',
          password: 'Real Man',
          subscription: false
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });

    chai
      .request(app)
      .post('/user/register')
      .set('content-type', 'application/json')
      .send({
        confirmed: false,
        email: 'pupkin@mail.com',
        image: 'lint to s3',
        interfaceLang: 'en',
        name: 'Ivan',
        password: 'Real Man',
        subscription: false
      })
      .end((err, res) => {
        test();
      });
  });
});
