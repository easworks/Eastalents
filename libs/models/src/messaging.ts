import { DateTime } from 'luxon';

export interface MessageRoom {
  _id: string;
  users: string[];
  created: DateTime;
  updated: DateTime;
}

export interface Message {
  _id: string;
  createdAt: DateTime;
  text: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}
