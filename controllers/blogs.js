const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  //console.log('get request to /api/blogs')
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    ...request.body,
    user: user.id
  })

  if (blog.title && blog.url) {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  }
  else {
    response.status(400).end()
  }
  response.status(400).end()
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const blogToDelete = await Blog.findById(request.params.id)

  if (blogToDelete.user.toString() === user.id) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
  else {
    return response.status(401).json({ error: 'token invalid' })
  }
})

blogsRouter.put('/:id', async (request, response) => {

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
  //console.log('updated blog: ', updatedBlog)
  response.json(updatedBlog)
})

module.exports = blogsRouter