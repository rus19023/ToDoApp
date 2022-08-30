import ToDos from "./ToDos.js";

window.addEventListener("load", () => {
    const myTodos = new ToDos("todos");
    myTodos.listActive();
});
