import ToDos from "./dToDos.js";

window.addEventListener("load", () => {
    const myDTodos = new ToDos("todos");
    myDTodos.addSampleTodos();
    myDTodos.listAll();
});
