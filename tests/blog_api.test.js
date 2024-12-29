const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')

//console.log(helper.initialBlogs)
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 2)
})

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.every(n => n.id), true)
})

test.only('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'blogi 6',
    author: 'Jonne',
    url: 'moi/2423',
    likes: 40
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(n => n.title)

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  assert(titles.includes('blogi 6'))
})

after(async () => {
  await mongoose.connection.close()
})