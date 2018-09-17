var generatePosts = require('./post')

module.exports = function api () {
  return {
    post: generatePosts()
  }
}

