const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated

beforeEach(setupDatabase);

describe('Signing up users', () => {
  test('Should signup a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: ' Temp Test User ',
        email: ' test@temptestuser.com  ',
        password: 'TestPassword777! ',
      })
      .expect(201);

    // Assert that the database was changed correctly
    const user = await User.findById(res.body.user._id);
    expect(user).not.toBeNull;

    // Assertions about the response
    expect(res.body).toMatchObject({
      user: {
        name: 'Temp Test User',
        email: 'test@temptestuser.com',
      },
      token: user.tokens[0].token,
    });

    expect(user.password).not.toBe('123password123!');
  });
  test('Should not signup a new user without correct fields', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'Test User',
        password: 'TestPassword777!',
      })
      .expect(400);
  });
  test('Should not signup a user with the same email address', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'Test User 1',
        email: userOne.email,
        password: '123password123!',
      })
      .expect(400);
  });
});

describe('Logging in users', () => {
  test('Should login existing user', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({
        email: userOne.email,
        password: userOne.password,
      })
      .expect(200);

    // Assert that the login token matches the 2nd token in the user object
    const user = await User.findById(userOneId);
    expect(res.body.token).toBe(user.tokens[1].token);
  });

  test('Should not login nonexistent user', async () => {
    await request(app)
      .post('/users/login')
      .send({
        email: 'incorrect@email.com',
        password: 'falsePassword123',
      })
      .expect(400);
  });
});

describe('Getting profiles', () => {
  test('Should get profile for user', async () => {
    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({})
      .expect(200);
  });

  test('Should not get profile for unauthenticated user', async () => {
    await request(app).get('/users/me').send().expect(401);
  });
});

describe('Updating user', () => {
  test('Should update valid user fields', async () => {
    await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        name: 'New User Name',
        email: 'new@email.com',
      })
      .expect(200);

    const user = await User.findById(userOneId);

    expect(user).toMatchObject({
      name: 'New User Name',
      email: 'new@email.com',
    });
  });
  test('Should not update invalid user fields', async () => {
    //
    const res = await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        job: 'Web developer',
        age: '22',
      })
      .expect(400);
  });
});

describe('Deleting accounts', () => {
  test('Should delete account for user', async () => {
    await request(app)
      .delete('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({})
      .expect(200);

    // Assert user does not exist
    const user = await User.findById(userOne._id);
    expect(user).toBeNull();
  });

  test('Should not delete account for unauthenticated user', async () => {
    await request(app).delete('/users/me').send({}).expect(401);
  });
});

describe('User avatar', () => {
  test('Should upload avatar image', async () => {
    await request(app)
      .post('/users/me/avatar')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .attach('avatar', 'tests/fixtures/image.jpeg')
      .expect(200);

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
  });
});
