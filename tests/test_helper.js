const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'mitähän',
    author: 'Otso',
    url: 'moi/moi',
    likes: 4,
  },
  {
    title: 'blogi 2',
    author: 'Otso',
    url: 'moi/2',
    likes: 4,
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}