var faker = require('faker')

faker.locale = 'zh_CN'

function generatePosts () {
  var posts = []
  for (var id = 0; id < 50; id++) {
    posts.push({
      id: id,
      type: Math.round(Math.random() * 6),
      title: faker.lorem.words(),
      content: faker.lorem.text(),
    })
  }
  return posts
}

module.exports = generatePosts

