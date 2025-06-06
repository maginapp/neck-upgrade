import { run } from './bin';

const args = process.argv.slice(2);

console.log('args is', args);

run(args);
