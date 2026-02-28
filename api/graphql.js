const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const typeDefs = require('../graphql/typeDefs');
const resolvers = require('../graphql/resolvers');

dotenv.config();

const app = express();
let serverStarted = false;

async function startServer() {
  if (serverStarted) return;

  await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => ({
      message: error.message,
      status: error.extensions?.code || 'ERROR',
    }),
  });

  await server.start();

  app.use(cors());

  // Vercel already parses the body, so we need to handle both cases:
  // 1. Vercel serverless: req.body is already parsed
  // 2. Local dev: req.body needs to be parsed by express.json()
  app.use((req, res, next) => {
    if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
      // Body already parsed by Vercel
      next();
    } else {
      // Parse body with Express
      express.json({ limit: '10mb' })(req, res, next);
    }
  });

  const middleware = expressMiddleware(server, {
    context: async ({ req }) => ({ req }),
  });

  app.use('/graphql', middleware);
  app.use('/api/graphql', middleware);
  app.use('/', middleware);

  serverStarted = true;
}

module.exports = async (req, res) => {
  await startServer();
  app(req, res);
};
