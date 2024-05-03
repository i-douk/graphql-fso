const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('apollo-server')

const MONGODB_URI = process.env.MONGODB_URI
console.log(MONGODB_URI)
console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
  type Book {
      title: String!
      published: String!
      author: String!
      genres: [String!]
      id: ID!
  }
  type Author {
      name: String!
      born: Int
      bookCount: Int
      id : ID!
    }
  type Query {
      bookCount: Int!
      authorCount: Int!
      allBooks(author: String , genre: String) : [Book!]!
      allAuthors: [Author!]!
   }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]
    ): Book
    addAuthor(
      name: String!
    ): Author
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
}
`

const resolvers = {
  Query: {
    authorCount: () =>  Author.collection.countDocuments(),
    bookCount: () =>  Book.collection.countDocuments(),
    allAuthors: async () => await Author.find({}),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        const books = await Book.find({})
        return books
      }
      if (args.author) {
        const booksByAuthor = await Book.find({ author: args.author })
        return booksByAuthor
      }
      if (args.genre) {
        const booksByGenre = await Book.find({ genres: { $in: [args.genre] } })
        return booksByGenre
      }
    },
  },
  Author: {
    bookCount: async (root) => {
      const booksByAuthor = await Book.find({ author: root.name })
      return booksByAuthor.length
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      const existingBook = await Book.findOne({ title: args.title, author: args.author })
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
      return book.save()
    },
    addAuthor: async (root, args) => {
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
    editAuthor: async (root, args) => {
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
  },
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})