import { DateTime } from 'luxon';
import { Entity } from './entity';

export interface KeyValDocument<T = unknown> extends Entity {
  value: T;
  updatedOn?: DateTime;
};
