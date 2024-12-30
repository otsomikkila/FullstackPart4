const { test, after, beforeEach, describe } = require('node:test')
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

test('a valid blog can be added ', async () => {
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

test('if likes is missing a default of 0 is added', async () => {
  const newBlog = {
    title: 'blogi 7',
    author: 'Janne',
    url: 'moi/24as'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.filter(n => n.title === 'blogi 7')[0].likes, 0)
})

describe('Status code 400 is returned if blog is', async () => {
  test('missing title', async () => {
    const newBlog = {
      author: 'Janne',
      url: 'moi/24as',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
  test('missing url', async () => {
    const newBlog = {
      title: 'here it is',
      author: 'Janne',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

test('deleting a node', async () => {
  const response = await api.get('/api/blogs')
  const id = response.body[0].id

  //correct response code
  await api.delete(`/api/blogs/${id}`).expect(204)
  //blog not in list
  const newResponce = await api.get('/api/blogs')
  const blogsAtEnd = newResponce.body

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  const titles = blogsAtEnd.map(n => n.title)
  assert(!titles.includes('mitähän'))
  //add a way to check if the note is deleted from the db
})

describe.only('updating the blog should', async () => {
  //console.log(workingBlog)
  const workingBlog =
    {
      'title': 'blogi 2',
      'author': 'Otso',
      'url': 'moi/2',
      'likes': 45
    }

  test('work with correct blog', async () => {
    const response = await api.get('/api/blogs')
    const blogToChange = response.body[0]

    const putResponse = await api.put(`/api/blogs/${blogToChange.id}`).send(workingBlog).expect(200)
    assert.deepStrictEqual(workingBlog,
      {
        title: putResponse.body.title,
        author: putResponse.body.author,
        url: putResponse.body.url,
        likes: putResponse.body.likes
      })
  })
})

after(async () => {
  await mongoose.connection.close()
})