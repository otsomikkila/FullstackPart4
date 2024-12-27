const dummy = (blogs) => {
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}