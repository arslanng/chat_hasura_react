import { gql } from "@apollo/client";

export const USER_CREATED_MUTATION = gql`
  mutation user_created($object: users_insert_input!) {
    insert_users_one(object: $object) {
      id
      name
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation create_message($object: messages_insert_input!) {
    insert_messages_one(object: $object) {
      user {
        name
      }
      id
      message
    }
  }
`;

export const CHAT_SUB = gql`
  subscription MySubscription {
    messages(order_by: { created_at: asc }) {
      id
      message
      user {
        id
        name
        background_color
        text_color
      }
    }
  }
`;
