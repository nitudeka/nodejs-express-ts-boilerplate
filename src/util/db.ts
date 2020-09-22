import { MongoClient, Db } from "mongodb";

let _db: Db, _client: any;

export const initDb = async (mongoUri: string, dbName: string) => {
  if (_db) {
    return _db;
  }

  try {
    const client = await MongoClient.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db: Db = client.db(dbName);

    _db = db;
    _client = client;
    return _db;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getDb = () => {
  return _db;
};

export const closeDb = () => {
  _client.close();
};
