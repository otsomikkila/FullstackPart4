const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')

const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
})

describe.only('Creating a user should', async () => {
  test('work with a correct username and password ', async () => {
    const user =
    {
      username: 'otsoboy',
      name: 'Otso Mikkilä',
      password: 'salasana',
    }
    await api
      .post('/api/users')
      .send(user)
      .expect(201)
    const response = await api.get('/api/users')
    const addedUser = response.body[0]
    assert.equal(addedUser.username, user.username)
    assert.equal(addedUser.name, user.name)
  })
  test('not work with too short username', async () => {
    const user =
    {
      username: 'ot',
      name: 'Otso Mikkilä',
      password: 'salasana',
    }
    const post = await api
      .post('/api/users')
      .send(user)
      .expect(400)

    const response = await api.get('/api/users')

    assert.equal(post.body.error, 'username and password must be at least 3 characters long')
    assert.equal(response.body.length, 0)
  })
  test('not work with too short password', async () => {
    const user =
    {
      username: 'otsoboy',
      name: 'Otso Mikkilä',
      password: 'sa',
    }
    const post = await api
      .post('/api/users')
      .send(user)
      .expect(400)

    const response = await api.get('/api/users')

    assert.equal(post.body.error, 'username and password must be at least 3 characters long')
    assert.equal(response.body.length, 0)
  })
  test('not work with non unique username', async () => {
    const user =
    {
      username: 'otsoboy',
      name: 'Otso Mikkilä',
      password: 'salasana',
    }
    await api
      .post('/api/users')
      .send(user)

    const duplicatePost = await api
      .post('/api/users')
      .send(user)
      .expect(400)

    assert.equal(duplicatePost.body.error, 'expected `username` to be unique')

    const response = await api.get('/api/users')
    assert.equal(response.body.length, 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})