import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Todo } from '../entities/Todo';
import path from 'path';
import fs from 'fs';

const DATABASE_PATH = process.env.DATABASE_PATH || './data/todos.db';

// Resolve the database path
const resolvedDbPath = path.isAbsolute(DATABASE_PATH)
  ? DATABASE_PATH
  : path.resolve(process.cwd(), DATABASE_PATH);

// Ensure the directory exists
const dbDir = path.dirname(resolvedDbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

declare global {
  // eslint-disable-next-line no-var
  var _dataSource: DataSource | undefined;
}

const AppDataSource = global._dataSource ||
  new DataSource({
    type: 'better-sqlite3',
    database: resolvedDbPath,
    synchronize: true,
    logging: false,
    entities: [Todo],
  });

if (process.env.NODE_ENV !== 'production') {
  global._dataSource = AppDataSource;
}

export async function getDataSource(): Promise<DataSource> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}

export { AppDataSource };
