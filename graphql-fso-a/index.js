const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

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
      author: Author!
      id: ID!
  }
  type Author {
      name: String!
      id: ID!
    }
  type Query {
      bookCount: Int!
      authorCount: Int!
}
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
  }
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

// let persons = [
//   {
//     name: "Arto Hellas",
//     phone: "040-123543",
//     street: "Tapiolankatu 5 A",
//     city: "Espoo",
//     id: "3d594650-3436-11e9-bc57-8b80ba54c431"
//   },
//   {
//     name: "Matti Luukkainen",
//     phone: "040-432342",
//     street: "Malminkaari 10 A",
//     city: "Helsinki",
//     id: '3d599470-3436-11e9-bc57-8b80ba54c431'
//   },
//   {
//     name: "Venla Ruuska",
//     street: "Nallemäentie 22 C",
//     city: "Helsinki",
//     id: '3d599471-3436-11e9-bc57-8b80ba54c431'
//   },
// ]

// const typeDefs = 
// `
// type Address {
//   street: String!
//   city: String! 
// }

// type Person {
//   name: String!
//   phone: String
  
//   address: Address!
//   id: ID!
// }

// enum YesNo {
//   YES
//   NO
// }
//   type Query {
//     personCount: Int!
//     allPersons(phone: YesNo): [Person!]!
//     findPerson(name: String!): Person
//   }

//   type Mutation {
//     addPerson(
//       name: String!
//       phone: String
//       street: String!
//       city: String!
//     ): Person
//     editNumber(
//       name: String!
//       phone: String!
//     ): Person
//   }
// `

// const resolvers = {
//   Query: {
//     personCount: () => persons.length,
//     allPersons: (root, args) => {
//       if (!args.phone) {
//         return persons
//       }
//       const byPhone = (person) =>
//       args.phone === 'YES' ? person.phone : !person.phone
//       return persons.filter(byPhone)
//     },  findPerson: (root, args) =>
//       persons.find(p => p.name === args.name)
//   },
//   Person: {
//     address: (root) => {
//       return {
//         street: root.street,
//         city: root.city
//       }
//     }
//   },
//   Mutation: {
//     addPerson: (root, args) => {
//       if (persons.find(p => p.name === args.name)) {
//         throw new GraphQLError('Name must be unique',
//         {
//           extensions: {
//             code: 'BAD_USER_INPUT',
//             invalidArgs: args.name}
//         })
//   }
//       const person = { ...args, id: uuid() }
//       persons = persons.concat(person)
//       return person
//     }
//   },
//   editNumber: (root, args) => {
//     const person = persons.find(p => p.name === args.name)
//     if (!person) {
//       return null
//     }

//     const updatedPerson = { ...person, phone: args.phone }
//     persons = persons.map(p => p.name === args.name ? updatedPerson : p)
//     return updatedPerson
//   }   
// }

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// })

// startStandaloneServer(server, {
//   listen: { port: 4000 },
// }).then(({ url }) => {
//   console.log(`Server ready at ${url}`)
// })