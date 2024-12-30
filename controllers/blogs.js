const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  //console.log('get request to /api/blogs')
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  if (blog.title && blog.url) {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  }
  else {
    response.status(400).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
  //console.log('updated blog: ', updatedBlog)
  response.json(updatedBlog)
})

module.exports = blogsRouter