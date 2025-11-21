export const debounce = (callback, delay) => {
  let timer = null;
  return {
    timer: () => timer,
    debounceFn: (...args) => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        callback(...args);
      }, delay);
    },
  };
};
