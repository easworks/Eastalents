import { MongoClient } from 'mongodb';
import { environment } from './environment';

const connectionString = environment.mongodb;
export const mongo = new MongoClient(connectionString);

