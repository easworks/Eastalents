import { PromiseExecutor } from '@nx/devkit';
import { NgApplicationExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<NgApplicationExecutorSchema> = async (
  options,
) => {
  console.log('Executor ran for NgApplication', options);
  return {
    success: true,
  };
};

export default runExecutor;
