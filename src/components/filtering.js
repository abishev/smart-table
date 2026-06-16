import { createComparison, defaultRules } from "../lib/compare.js";

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  Object.keys(indexes).forEach((elementName) => {
    const selectElement = elements[elementName];
    if (selectElement) {
      selectElement.innerHTML = "";

      const allOption = document.createElement("option");
      allOption.value = "";
      allOption.textContent = "Все";
      selectElement.appendChild(allOption);

      Object.values(indexes[elementName]).forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        selectElement.appendChild(option);
      });
    }
  });

  return function applyFiltering(data, state, action) {
    if (action && action.name === "clear") {
      const parent = action.parentElement;
      if (parent) {
        const input = parent.querySelector("input");
        if (input) {
          input.value = "";
          state[input.name] = "";
        }
      }
    }

    return data.filter((row) => compare(row, state));
  };
}
