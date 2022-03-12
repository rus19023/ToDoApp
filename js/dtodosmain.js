import ToDos from "./ToDos.js";

let count = 0;
window.addEventListener("load", () => {
    const myDTodos = new ToDos("dtodos");
    myDTodos.addSampleTodos();
    myDTodos.listAll();
});
