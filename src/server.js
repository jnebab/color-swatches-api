const { ApolloServer, gql } = require('apollo-server');
const { ApolloServer: ApolloServerLambda } = require('apollo-server-lambda')

//color swatches list
const colorSwatches = require('./colorSwatches')

const typeDefs = gql`
  type ColorSwatch {
    name: String,
    hex: String,
  }

  type ColorSwatches {
    total: Int,
    currentCount: Int,
    data: [ColorSwatch]
  }

  type Query {
    colorSwatch(hex: String!): ColorSwatch,
    colorSwatches(first: Int, offset: Int): ColorSwatches
  }
`;

const queryColorSwatches = (hex) => {
  return colorSwatches.filter((colorSwatch) => {
        return colorSwatch.hex == hex
  });
}

const queryAllColorSwatches = (first, offset = 0) => {

  if(first < 0) {
    throw new Error('first value must be positive')
  }

  const totalCount = colorSwatches.length
  const filteredColorSwatches = first === undefined ? colorSwatches.slice(offset) : colorSwatches.slice(offset, offset + first) 

  return {
    total: totalCount,
    currentCount: filteredColorSwatches.length,
    data: filteredColorSwatches
  }
}

const resolvers = {
  Query: {    
    colorSwatch: (parent, args, context, info) => {
      return queryColorSwatches(args.hex)[0]
    },
    colorSwatches: (parent, args, context, info) => {
      return queryAllColorSwatches(args.first, args.offset)
    }
  },
};

function createLambdaServer () {
  return new ApolloServerLambda({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
  });
}

function createLocalServer () {
  return new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
  });
}

module.exports = { createLambdaServer, createLocalServer }