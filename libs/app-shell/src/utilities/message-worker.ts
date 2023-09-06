export function messageWorker<T>(worker: Worker, data: any) {
  return new Promise<T>((resolve, reject) => {
    const mc = new MessageChannel();
    mc.port1.onmessage = event => {
      mc.port1.close();
      resolve(event.data as unknown as T);
    };
    mc.port1.onmessageerror = event => {
      mc.port1.close();
      reject(event);
    };
    worker.postMessage(data, [mc.port2]);
  });
}

export function messageAndClose(port: MessagePort, data: any) {
  port.postMessage(data);
  port.close();
}
