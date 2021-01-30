const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  setupDatabase,
} = require('./fixtures/db');

// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks

beforeEach(setupDatabase);

describe('Creating tasks', () => {
  test('Should create task for user', async () => {
    //
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({ description: 'Task from test' })
      .expect(201);

    const task = await Task.findById(res.body._id);
    expect(task).not.toBeNull();
    expect(task.description).toBe('Task from test');
    expect(task.completed).toEqual(false);
  });
});

describe('Get tasks', () => {
  test('', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

    expect(res.body.length).toEqual(2);
  });
});

describe('Delete tasks', () => {
  test('User one should be able to delete their own task', async () => {
    await request(app)
      .delete(`/tasks/${taskOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);
    const task = await Task.findById(taskOne._id);
    expect(task).toBe(null);
  });
  test('User two should not be able to delete tasks from other users', async () => {
    await request(app)
      .delete(`/tasks/${taskOne._id}`)
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send()
      .expect(404);
    const task = Task.findById(taskOne._id);
    expect(task).not.toBeNull();
  });
});
