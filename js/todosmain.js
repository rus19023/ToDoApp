import ToDos from "./ToDos.js";

window.addEventListener("load", () => {
    const myTodos = new ToDos("todos");
    myTodos.listAll();
    //debugger;
    const myDTodos = new ToDos("dtodos");
    myDTodos.addDTodos();
});

