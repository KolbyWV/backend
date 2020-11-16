const bcrypt = require('bcryptjs')
const models = require('../models')

const resolvers = {
    Query: {
        async me(_, args,{ user }) {
            return await models.User.findByPk(user.id)
        },
        async user (root, { id }, context) {
            try {
                return models.User.findByPk(id)
            } catch (error) {
                throw new Error(error.message)
            }
        },
        async allUpdates (root, args, context) {
            try {
                return models.Update.findAll()
            } catch (error) {
                throw new Error('Something is up with the scrapes, homie')
            }
        },
        async allMangas (root, args, { user }) {
            try {

                return models.Manga.findAll({where:{UserId: user.id}})
            } catch (error) {
                throw new Error('You have not saved any yet!')
            }
        },
        async manga (root, { id }, { user }) {
            try {

                return models.Manga.findByPk(id)
            } catch (error) {
                throw new Error(error.message)
            }
      }
    },
    Mutation: {
        async registerUser (root, { name, email, password }) {
            try {
                const user = await models.User.create({
                  name,
                  email,
                  password: await bcrypt.hash(password, 10)
                })
                return {
                  id: user.id, name: user.name, email: user.email, message: "Authentication successful"
                }
              } catch (error) {
                throw new Error(error.message)
              }
        },
        async login(_, { email, password }) {
            try {
              const user = await models.User.findOne({ where: { email }})
              if (!user) {
                throw new Error('No user with that email')
              }
              const isValid = await bcrypt.compare(password, user.password)
              if (!isValid) {
                throw new Error('Incorrect password')
              }
              return {
               user
              }
          } catch (error) {
            throw new Error(error.message)
          }
        },
        async createManga (root, { UserId, title, url, img, source }) {
            return models.Manga.create({ UserId, title, url, img, source })
        }
    },
    User: {
        async mangas (user) {
            return user.getMangas()
        }
    },
    Manga: {
        async user (manga) {
            return manga.getUser()
        }
    }

}


module.exports = resolvers