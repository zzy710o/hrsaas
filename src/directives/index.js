export const imgerror = {
  inserted(el, options) {
    el.onerror = function () {
      el.src = options.value;
    };
  },
};
