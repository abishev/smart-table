export function initFiltering(elements) {
  const updateIndexes = (indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      const target = elements[elementName];
      if (!target) return;
      const defaultOption = target
        .querySelector('option[value=""]')
        ?.cloneNode(true);
      const options = Object.values(indexes[elementName]).map((name) => {
        const el = document.createElement("option");
        el.textContent = name;
        el.value = name;
        return el;
      });
      target.replaceChildren(...[defaultOption, ...options].filter(Boolean));
    });
  };

  const applyFiltering = (query, state, action) => {
    if (action && action.name === "clear") {
      const parent = action.parentElement;
      const input = parent?.querySelector("input, select");
      const field = action.dataset.field;
      if (input) {
        input.value = "";
      }
      if (field && field in state) {
        state[field] = "";
      }
    }

    const filter = {};
    Object.keys(elements).forEach((key) => {
      const el = elements[key];
      if (!el) return;
      if ((el.tagName === "INPUT" || el.tagName === "SELECT") && el.value) {
        filter[`filter[${el.name}]`] = el.value;
      }
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
