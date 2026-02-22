const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

dotenv.config();

const startServer = async () => {
  const app = express();

  // Connect to MongoDB
  await connectDB();

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      return {
        message: error.message,
        status: error.extensions?.code || 'ERROR'
      };
    }
  });

  await server.start();

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Apply Apollo middleware
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => ({ req })
  }));

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
  });
};

startServer().catch(console.error);
