// src/schema.js

const { gql } = require('apollo-server')

const typeDefs = gql`
    type User {
        id: Int!
        name: String!
        email: String!
        mangas: [Manga]
      }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Update {
        id: Int!
        title: String!
        url: String!
        img: String!
        time: String!
        chapter: String!
        chapterUrl: String!
        source: String!
    }

    type Manga {
        id: Int!
        title: String!
        url: String!
        source: String!
        user: User!
    }

    type Query {
        user(id: Int!): User
        allUpdates: [Update!]!
        allMangas: [Manga!]!
        manga(id: Int!): Manga
        me: User
    }

    type Mutation {
        registerUser(name: String!, email: String!, password: String!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
        createManga(UserId: Int!, title: String!, url: String!, source: String!): Manga!
    }
`

module.exports = typeDefs