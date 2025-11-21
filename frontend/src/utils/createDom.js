export function createDom(htmlString, isFragment = true) {
  const range = document.createRange();
  const fragment = range.createContextualFragment(htmlString);
  return fragment;
}
