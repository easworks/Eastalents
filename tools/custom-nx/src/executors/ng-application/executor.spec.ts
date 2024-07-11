import { ExecutorContext } from '@nx/devkit';

import { NgApplicationExecutorSchema } from './schema';
import executor from './executor';

const options: NgApplicationExecutorSchema = {};
const context: ExecutorContext = {
  root: '',
  cwd: process.cwd(),
  isVerbose: false,
};

describe('NgApplication Executor', () => {
  it('can run', async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
