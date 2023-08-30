export const environment = {
  port: getPort()
} as const;

function getPort() {
  const port = Number.parseInt(process.env['PORT'] || '');
  if (!port)
    throw new Error('port not specified');

  return port;
}
