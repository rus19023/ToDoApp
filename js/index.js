import TodosController from "./todosController.js";

const myTodosController = new TodosController("todos");
window.addEventListener("load", () => {
  myTodosController.showAll();
});

let itemsArray = {
  itemKey: 1,
  itemName: "buy eggs",
  itemDone: false,
};

//localStorage.setItem('items', JSON.stringify(itemsArray));

const data = JSON.parse(localStorage.getItem("items"));
console.log(data);
