//create an array of todos
const todoList = [
  {
    itemKey: 1,
    itemName: "Buy Milk",
    itemDone: false
  },
  {
    itemKey: 2,
    itemName: "Buy Eggs",
    itemDone: false
  }
];

class todosModel {
  getAllTodos() {
    console.log(`getAllTodos(): ${todoList}`);
    return JSON.stringify(todoList);
  }
  // Get just one todo.
  getTodoByName(todoName) {
    return todoList.find((todo) => todo.itemName === todoName);
  }
}

export default todosModel;