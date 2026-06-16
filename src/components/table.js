import { cloneTemplate } from "../lib/utils.js";

export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // ✅ Исправлено: [...before] чтобы не мутировать
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

  // ✅ Исправлено: добавлена задержка 0
  root.container.addEventListener("reset", () => {
    setTimeout(onAction, 0);
  });

  root.container.addEventListener("submit", (e) => {
    e.preventDefault();
    onAction(e.submitter);
  });

  const render = (data) => {
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
    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
