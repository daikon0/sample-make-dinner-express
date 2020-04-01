'use strict';
const request = require('supertest');
const app = require('../app');
const passportStub = require('passport-stub');
const superagent = require('superagent');

const User = require('../models/user');
const Dish = require('../models/dish');

describe('/login', () => {
  before(() => {
    passportStub.install(app);
    passportStub.login({ username: 'testuser' });
  });

  after(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  it('ログイン時はユーザー名が表示される', (done) => {
    request(app)
      .get('/login')
      .expect(/testuser/)
      .expect(200, done);
  });

});

describe('/logout', () => {
  it('/logoutにアクセスをした際に/にリダイレクトされる', (done) => {
    request(app)
      .get('/logout')
      .expect('Location', '/')
      .expect(302, done);
  });
});

describe('/menu', () => {
  before(() => {
    passportStub.install(app);
    passportStub.login({ userId: 0, username: 'testuser', password: 'testpassword' });
  });

  after(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  it('料理が作成でき表示される', (done) => {
    User.upsert({ userId: 0, username: 'testuser', password: 'testpassword' }).then(() => {
      request(app)
        .post('/menu')
        .send({ dishName: 'テスト', genre: '和食', role: '主菜'})
        .expect('Location', /menu/)
        .expect(302)
        .end((err, res) => {
          request(app)
            .get(/menu/)
            .expect(/テスト/)
            .expect(/和食/)
            .expect(/主菜/)
            .expect(200)
            .end((err, res) => {
              Dish.findAll({
                where: { dishName: 'テスト'}
              }).then((dish) => {
                const promises = dish.map((d) => { return d.destroy(); })
                return Promise.all(promises);
              }).then(() => {
                if (err) return done (err);
                 return done();
              });
            });
        });
    });
  });
});