import { PromiseExecutor } from '@nx/devkit';
import { NgPackSsrExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<NgPackSsrExecutorSchema> = async (
  options,
) => {
  console.log('Executor ran for NgPackSsr', options);
  return {
    success: true,
  };
};

export default runExecutor;
