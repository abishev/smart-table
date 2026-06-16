import { cloneTemplate } from "../lib/utils.js";

export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  [...before].reverse().forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.prepend(root[subName].container);
  });

  after.forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.append(root[subName].container);
  });

  root.container.addEventListener("change", () => {
    onAction();
  });

  root.container.addEventListener("reset", () => {
    setTimeout(onAction, 0);
  });

  root.container.addEventListener("submit", (e) => {
    e.preventDefault();
    onAction(e.submitter);
  });

  const render = (data) => {
    // Ищем контейнер для строк
    let rowsContainer = root.container.querySelector("tbody");
    if (!rowsContainer) {
      rowsContainer = root.container.querySelector("table");
    }
    if (!rowsContainer) {
      rowsContainer = root.elements.rows; // запасной вариант
    }
    if (!rowsContainer) {
      console.error("Не найден контейнер для строк");
      return;
    }

    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);
      const elements = row.container.querySelectorAll("[data-name]");
      elements.forEach((el) => {
        const key = el.dataset.name;
        if (item[key] !== undefined) {
          el.textContent = item[key];
        }
      });
      return row.container;
    });

    rowsContainer.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
