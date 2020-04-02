'use strict';
const request = require('supertest');
const app = require('../app');
const passportStub = require('passport-stub');
const assert = require('assert');

const deleteDish = require('../routes/menu').deleteDish;

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
                done();
              });
            });
        });
    });
  });
});

describe('/menu/:dish.dishId?edit=1', () => {
  before(() => {
    passportStub.install(app);
    passportStub.login({ userId: 0, username: 'testuser', password: 'testpassword'});
  });

  after(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  it('料理を更新できる', (done) => {
    User.upsert({ userId: 0, username: 'testuser', password: 'testpassword' }).then(() => {
      request(app)
      .post(/menu/)
      .send({ dishName: 'テスト', dishUrl:'http://test',  genre: '和食', role: '主菜' })
      .end((err, res) => {
        Dish.findOne({
          where: { dishName: 'テスト'}
        }).then((dish) => {     
          request(app)
            .post(`/menu/${dish.dishId}?edit=1`)
            .send({ dishName: 'テスト2', dishUrl: 'http://test2' })
            .end((err, res) => {
              Dish.findOne({
                where: { dishName: 'テスト2' }
              }).then((dish) => {
                assert.equal(dish.dishName, 'テスト2');
                assert.equal(dish.dishUrl, 'http://test2');
                deleteDish(dish.dishId, done, err);
              });
            });
        });
      });
    });
  });
});