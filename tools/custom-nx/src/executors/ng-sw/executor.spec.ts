import { ExecutorContext } from '@nx/devkit';
import executor from './executor';
import { NgSwExecutorSchema } from './schema';

const options: NgSwExecutorSchema = {};
const context: ExecutorContext = {
  root: '',
  cwd: process.cwd(),
  isVerbose: false,
};

describe('ng-sw executor', () => {
  it('can run', async () => {
    const output = (await executor(options, context).next()).value;
    expect(output.success).toBe(true);
  });
});
