const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogs) => {
  console.log(blogs)
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  console.log(blogs.map(n => n.likes))
  return blogs.reduce(reducer, 0)
}

module.exports = {
  dummy,
  totalLikes
}