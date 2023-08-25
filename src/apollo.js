import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const headers = {
  "content-type": "application/json",
  "x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET
};

const wsLink = new WebSocketLink({
  uri: "ws://chat-app-arslanng.hasura.app/v1/graphql",
  options: {
    reconnect: true,
    connectionParams: {
      headers
    },
  }
})

const httpLink = new HttpLink({
  uri: "https://chat-app-arslanng.hasura.app/v1/graphql",
  headers
})

const splitLink = split(
  ({query }) => {
    const defination = getMainDefinition(query)
    return defination.kind === 'OperationDefinition' && defination.operation === "subscription"
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;