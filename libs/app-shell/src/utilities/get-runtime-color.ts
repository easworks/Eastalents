export function getTailwindColor(className: string) {
  const el = document.createElement('div');
  el.className = className;
  el.classList.add('!hidden');
  document.body.appendChild(el);

  const color = getComputedStyle(el).backgroundColor;

  el.remove()
  return color;
}