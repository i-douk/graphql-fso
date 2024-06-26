const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const resolvers = {
    Query: {
      existingGenres: async () => {
        const books = await Book.find({})
        const genresArray = books.map( b => b.genres).flat()
        const uniqueGenres = Array.from(new Set(genresArray))
        return uniqueGenres
      },
      me: (root, args, context) => { return context.currentUser },
      authorCount: () =>  Author.collection.countDocuments(),
      bookCount: () =>  Book.collection.countDocuments(),
      allAuthors: async () => await Author.find({}),
      allBooks: async (root, args) => {
        if (!args.author && !args.genre) {
          const books = await Book.find({}).populate('author')
          return books
        }
        if (args.author) {
          const booksByAuthor = await Book.find({ author: args.author }).populate('author')
          return booksByAuthor
        }
        if (args.genre) {
          const booksByGenre = await Book.find({ genres: { $in: [args.genre] } }).populate('author')
          return booksByGenre
        }
      },
    },
    Author: {
      bookCount: async (root) => {
        const booksByAuthor = await Book.find({ author: root._id })
        return booksByAuthor.length
      },
    },
    Mutation: {
      addBook: async (root, args, context) => {
        const currentUser = context.currentUser
        if (!currentUser) {
            throw new GraphQLError('not authenticated', {
                extensions: {
                    code: 'BAD_USER_INPUT'
                }
            })
        }
  
        const existingBook = await Book.findOne({ title: args.title })
        if (existingBook) {
          throw new GraphQLError('Title by author must be unique', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
            },
          })
        }
        if (args.title.length < 5) {
          throw new GraphQLError('Title is too short', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
            },
          })
        }
  
        let author = await Author.findOne({ name: args.author })
        if (!author) {
          author = new Author({ name: args.author })
          await author.save()
        }
  
        const book = new Book({ ...args, author: author._id })
        const bookPopulated = book.populate('author')
        pubsub.publish('BOOK_ADDED', { bookAdded: bookPopulated })
        return book.save()
      },
      addAuthor: async (root, args ,context) => {
        const currentUser = context.currentUser
        if (!currentUser) {
            throw new GraphQLError('not authenticated', {
              extensions: {
              code: 'BAD_USER_INPUT'
            }
        })
        }
        const existingAuthor = await Author.findOne({ name: args.name })
        if (existingAuthor) {
          throw new GraphQLError('Author already exists', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
            },
          })
        }
        const newAuthor = new Author({ name: args.name })
            try {
               await newAuthor.save()
              } catch (error) {
                throw new GraphQLError('Saving author failed', {
                  extensions: {
                    code: 'BAD_USER_INPUT',
                    invalidArgs: args.name,
                    error
                  }
                })
            }
          return newAuthor
      },
      editAuthor: async (root, args ,context) => {
        const currentUser = context.currentUser
        if (!currentUser) {
            throw new GraphQLError('not authenticated', {
              extensions: {
              code: 'BAD_USER_INPUT'
            }
        })
        }
        const author = await Author.findOne({ name: args.name })
        if (!author) {
          return null
        }
        author.born = args.setBornTo
        try {
            await author.save()
          } catch (error) {
            throw new GraphQLError('Editing author failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.setBornTo,
                error
              }
            })
          }
          return author
      },
      createUser: async (root, args) => {
        const user = new User({ username: args.username , favoriteGenre: args.favoriteGenre })
        return user.save()
          .catch(error => {
            throw new GraphQLError('Creating the user failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.username,
                error
              }
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
        if ( !user || args.password !== 'secret' ) {
          throw new GraphQLError('wrong credentials', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })        
        }
        const userForToken = {
          username: user.username,
          id: user._id,
        }
        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      },
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        },
    },
  }

  module.exports = resolvers