export const observerElement = (elm: Element, cb: () => void) => {
  const resizeObserver = new ResizeObserver(cb);
  resizeObserver.observe(elm);
  return {
    dispose: () => resizeObserver.disconnect(),
  };
};
