const { ApolloServer } = require('apollo-server')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const { asyncScrape } = require('./crawl')
const scrape = asyncScrape()

const server = new ApolloServer({
  typeDefs,
  scrape,
  resolvers,
  introspection: true,
  playground: true
})

server
  .listen(process.env.PORT || 4000)
  .then(({ url }) => console.log('Server is running on localhost:4000'))