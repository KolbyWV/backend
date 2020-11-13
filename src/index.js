const { ApolloServer } = require('apollo-server')
const jwt =  require('jsonwebtoken')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

require('dotenv').config()
const { JWT_SECRET, PORT } = process.env
const getUser = token => {
  try {
    if (token) {
      return jwt.verify(token, JWT_SECRET)
    }
    return null
  } catch (error) {
    return null
  }
}

const { asyncScrape } = require('./crawl')
const scrape = asyncScrape()

const server = new ApolloServer({
  typeDefs,
  scrape,
  resolvers,
  context: ({ req }) => {
    const token = req.get('Authorization') || ''
    return { user: getUser(token.replace('Bearer', ''))}
  },
  introspection: true,
  playground: true
})

server
  .listen()
  .then(({ url }) => console.log('Server is running on localhost:4000'))