import { UseStore, promisifyRequest } from 'idb-keyval';

export function customKeyvalStore(dbName: string) {
  const getDbWithoutUpdate = () => promisifyRequest(indexedDB.open(dbName));

  let keyValDB$ = getDbWithoutUpdate();

  return function (storeName: string) {
    const probe$ = keyValDB$
      .then(db => {
        db.addEventListener('versionchange', () => {
          db.close();
        });
        return db;
      });

    const version$ = probe$
      .then(db => {
        const stores = db.objectStoreNames;
        if (!stores.contains(storeName)) {
          return db.version + 1;
        }
        else {
          return db.version;
        }
      });

    const upgrade$ = (async () => {
      const version = await version$;
      const probe = await probe$;

      if (version !== probe.version) {
        const upgrade = indexedDB.open(dbName, version);
        upgrade.addEventListener('upgradeneeded', () => {
          upgrade.result.createObjectStore(storeName);
        });
        return new Promise<void>((resolve) => {
          upgrade.addEventListener('success', () => {
            upgrade.result.close();
            resolve();
          });
        });
      }
    })();

    keyValDB$ = upgrade$.then(() => getDbWithoutUpdate());

    const store: UseStore = async <T>(txMode: IDBTransactionMode, callback: (store: IDBObjectStore) => T | PromiseLike<T>) => {
      const db = await keyValDB$;
      return callback(db.transaction(storeName, txMode).objectStore(storeName));
    };

    return store;
  };
}

