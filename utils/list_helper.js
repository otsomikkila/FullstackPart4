const _ = require('lodash')

const dummy = () => {
  //console.log(blogs)
  return 1
}

const totalLikes = (blogs) => {
  //console.log(blogs)
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  //console.log(blogs.map(n => n.likes))
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  let max = 0
  let result
  blogs.forEach(n => {
    if (n.likes > max) {
      max = n.likes
      result = n
    }
  })
  //console.log('result: ', result)
  //console.log('result: ' , { 'title': result.title, 'author': result.author, 'likes': result.likes } )
  return { 'title': result.title, 'author': result.author, 'likes': result.likes }
}

//make a hashmap that has person and amount
//transform hashmap into list of pairs
//sort the pairs
const mostBlogs = (blogs) => {

  const groupedByAuthor = _.groupBy(blogs, 'author')

  const authorCounts = _.map(groupedByAuthor, (value, key) => ({
    author: key,
    blogs: value.length,
  }))
  const mostBlogs = _.maxBy(authorCounts, 'blogs')
  //console.log(mostBlogs)
  return mostBlogs
}

const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author')

  const likeCounts = _.map(groupedByAuthor, (value, key) => ({
    author: key,
    likes: value.reduce((a,c) => a + c.likes, 0),
  }))

  const mostLikes = _.maxBy(likeCounts, 'likes')
  //console.log(groupedByAuthor)
  //console.log(mostLikes)
  return mostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}