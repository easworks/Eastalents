import { MongoClient } from 'mongodb';
import { initialiseMongo } from 'server-side/mongodb/collections';
import { environment } from './environment';

const connectionString = environment.mongodb;

const client = new MongoClient(connectionString);

export const easMongo = initialiseMongo(client); 