import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import React from 'react';
import Home from './Home';

const httpUrl =
  process.env.REACT_APP_BUILD === 'devel' ? 'http://localhost:4000/graphql' : 'https://memebz.herokuapp.com/graphql';
const webSocketUrl =
  process.env.REACT_APP_BUILD === 'devel' ? 'ws://localhost:4000/graphql' : 'wss://memebz.herokuapp.com/graphql';

// Create an http link:
const httpLink = new HttpLink({
  uri: httpUrl
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: webSocketUrl,
  options: {
    reconnect: true
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Home />
    </ApolloProvider>
  );
}

export default App;
