import { DateTime } from 'luxon';

export interface MessageRoom {
  _id: string;
  users: string[];
  created: DateTime;
  updated: DateTime;
}
