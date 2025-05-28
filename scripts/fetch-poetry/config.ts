import { join } from 'path';

export const TEMP_DIR = 'temp/chinese-poetry';
export const TARGET_DIR = 'public/data';
export const POETRY_FILE = join(TARGET_DIR, 'poetry.json');
export const LAST_UPDATE_FILE = join(TARGET_DIR, 'last-update-poetry.txt');
