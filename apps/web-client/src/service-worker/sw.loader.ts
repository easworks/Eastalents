// This function generates the URL, and ensures webpack includes the service worker
// But prevents the service worker from actually loading 
function generateUrl() {

  class WorkerStub {
    constructor(public url: string | URL, public options?: WorkerOptions) { }
  }

  const oldWorker = Worker;
  // Override the real Worker implementation with a stub
  // to return the filename, which will be generated/replaced by the worker-plugin.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line no-global-assign
  Worker = WorkerStub;
  const worker = new Worker(new URL('./sw.worker', import.meta.url), { type: 'module' }) as unknown as WorkerStub;

  // Revert the actual Worker implementation
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line no-global-assign
  Worker = oldWorker;


  return worker.url;
}

export const serviceWorkerUrl = generateUrl();
