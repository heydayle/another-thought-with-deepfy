import { openDB, type DBSchema } from 'idb';

interface DeepfyDB extends DBSchema {
    workflow_runs: {
        key: string;
        value: {
            log_id: string;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            inputs: Record<string, any>;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: any;
        };
        indexes: { 'created_at': number };
    };
}

const DB_NAME = 'deepfy-db';
const DB_VERSION = 1;

export const initDB = async () => {
    return openDB<DeepfyDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('workflow_runs')) {
                const store = db.createObjectStore('workflow_runs', {
                    keyPath: 'log_id',
                });
                store.createIndex('created_at', 'created_at');
            }
        },
    });
};
