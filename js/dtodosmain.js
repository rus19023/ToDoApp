import ToDos from "./ToDos.js";

let count = 0;
window.addEventListener("load", () => {
    const myDTodos = new ToDos("dtodos");
    //console.log(localStorage.getItem("ditems"));  // null
    //console.log(localStorage.getItem("items") === "");  // false

    // if localstorage items is empty and localstorage ditems is not empty, then load ditems to items
    //console.log(count);
    if (count < 1) {
        count++;
        myDTodos.addDTodos();
        // localStorage.removeItem("ditems");
    }
    //debugger;
});