import { createComparison, defaultRules } from "../lib/compare.js";

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  Object.keys(indexes).forEach((indexName) => {
    if (indexName === "sellers") {
      const options = Object.values(indexes[indexName]).map((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        return option;
      });
      const searchBySellerElement = elements.searchBySeller;
      options.forEach((option) => searchBySellerElement.appendChild(option));
    }
  });

  return (data, state, action) => {
    if (action && action.name === "clear") {
      action.parentElement.querySelector("input").value = "";
      state[action.dataset.field] = "";
    }
    return data.filter((row) =>
      compare(row, {
        ...state,
        total: [state.totalFrom, state.totalTo],
      }),
    );
  };
}
