import { ExecutorContext } from '@nx/devkit';

import { NgPackSsrExecutorSchema } from './schema';
import executor from './executor';

const options: NgPackSsrExecutorSchema = {};
const context: ExecutorContext = {
  root: '',
  cwd: process.cwd(),
  isVerbose: false,
};

describe('NgPackSsr Executor', () => {
  it('can run', async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
