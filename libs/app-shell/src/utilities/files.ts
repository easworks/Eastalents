export function saveJSON(object: unknown, filename?: string) {
  const json = JSON.stringify(object, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  return saveFile(blob, filename);
}

export function saveFile(blob: Blob, filename?: string) {
  const a = document.createElement('a');
  a.href = window.URL.createObjectURL(blob);
  if (filename) a.download = filename;
  a.click();
}
