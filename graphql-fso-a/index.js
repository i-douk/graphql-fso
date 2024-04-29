const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('apollo-server')
let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

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
      born: String
      bookCount: Int!
      id : ID!
    }
  type Query {
      bookCount: Int!
      authorCount: Int!
      allBooks(author: String , genre: String) : [Book!]
      allAuthors: [Author!]!
   }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    addAuthor(
      name: String!
    ): Author
}
`

const resolvers = {
  Query: {
    authorCount: () => authors.length,
    bookCount: (root,args) => books.length,
    allAuthors: () => authors,
    allBooks: (root,args) => {
      if(!args.author && !args.genre) {
        return books
      }
      if (args.author) {
        const booksByAuthor = books.filter(book=> book.author === args.author )
        return booksByAuthor
      }
      if (args.genre) {
        const booksByGenre = books.filter(book => book.genres.includes(args.genre))
        return booksByGenre
      }
    }
    },
    Author: {
      bookCount: (root) => {
        const booksByAuthor = books.filter(book => book.author === root.name);
        return booksByAuthor.length
      }
    },
    Mutation: {
      addBook: (root, args) => {
        if (books.find(b => b.title === args.title && b.author === args.author)) {
          throw new GraphQLError('Title by author must be unique',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title}
          })
    }
        const book = { ...args, id: uuid() }
        books = books.concat(book)
        if (!authors.some(author => author.name === args.author)) {
          const newAuthor = { name: args.author, id: uuid() };
          authors.push(newAuthor);
        }
        return book
      },
      addAuthor: (root, args) => {
        const authorToAdd = {name: args.author , id : uuid()}
        const book = books.filter( b=> b.author === args.author)
        if (!book) {
          authors = authors.concat(authorToAdd)
          return authorToAdd
        } else {
          return null
        }
      }
    },
  }

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})