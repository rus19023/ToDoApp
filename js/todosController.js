import TodosModel from "./todosModel.js";
import TodosView from "./todosView.js";

export default class TodosController {
    // a class needs a constructor
    constructor(parentId) {
        this.parentElement = document.getElementById(parentId);
        this.todoModel = new TodosModel();
        this.todosView = new TodosView(parentId);
    }

    onTap(event) {
      // If delete button is clicked/tapped, remove the todo from the local 0storage
      if ((event.target.id === 'delbtn')) {
        removeItem(event.target.id);
      }
      // If mark button is clicked/tapped, mark the done boolean as true
      if ((event.target.id === 'markbtn')) {
        markDone(event.target.id);
      }
      // If the add item is clicked/tapped, create a new local storage item
      if ((event.target.id === 'addbtn')) {
          // if there is no lastId set in local storage, set it to 0
            if (!localStorage.getItem('lastId')) {
                localStorage.setItem('lastId', 0);
            }
        this.itemDone = false;
        this.lastId = localStorage.getItem('lastId');
        this.itemName = document.getElementById('addinput').value;
        console.log(getElementById('addinput').value);
        createItem('items', this.lastId, this.itemName, this.itemDone);
      }
      // If the active button is clicked/tapped, show all active todos
      if ((event.target.id === 'actbtn')) {
        showActive();
      }
      // If the all button is clicked/tapped, show all todos
      if ((event.target.id === 'allbtn')) {
        showAll();
      }
      // If the done button is clicked/tapped, show all done todos
      if ((event.target.id === 'donbtn')) {
        showDone();
      }
    }
    //window.addEventListener('touchend', onTap);

    showAll() {
        // the list of todos will come from the model
        //const todolist = this.todosModel.getAllTodos();
        // send the list of todos and the element we would like those placed into to the view.
        //this.todoView.renderTodoList(this.parentElement, todolist);
        // after the todos have been rendered...add our listener
        //this.addTodoListener();
    }

    showOneTodo(todoName) {
        const todo = this.todosModel.gettodoByName(todoName);
        this.todosView.renderOneTodoFull(this.parentElement, todo).ontouchend =
        () => {
            this.showTodoList();
        };
    }

    showActive() {
        const todolist = this.todosModel.getAllTodos();
        const activeTodos = todolist.filter(todo => !todo.itemDone);
        this.todoView.renderTodoList(this.parentElement, activeTodos);
        this.addTodoListener();
    }

    showDone() {
        const todolist = this.todosModel.getAllTodos();
        const doneTodos = todolist.filter(todo => todo.itemDone);
        this.todoView.renderTodoList(this.parentElement, doneTodos);
        this.addTodoListener();
    }

    // Local storage helpers
    // get last item id from localStorage
   getLastId = () => {return localStorage.getItem('lastId', )};

    // save new last item id to localStorage
   setLastId = () => {localStorage.setItem('lastId', getLastId() + 1)};

    // get last item id from localStorage
   getListItems = () => localStorage.getItem(listItems);

    // save new item to localStorage
   createItem = (itemName) => {localStorage.setItem(this.getLastId() + 1, itemName, false)};

   // function to show how many items are left undone in the to do   list
   itemsLeft() {
       let items = document.getElementById("list").children.length;
       if ((items < 2) && (items > 0)) {
       document.getElementById(id).innerText = items + ' task left';
       } else {
       document.getElementById(id).innerText = items + ' tasks left';
       }
   }

  // in order to show the details of a todo ontouchend we will need to attach a listener AFTER the list of todos has been built. The function below does that.
  addTodoListener() {
    // We need to loop through the children of our list and attach a listener to each, remember though that children is a nodeList...not an array. So in order to use something like a forEach we need to convert it to an array.
    const childrenArray = Array.from(this.parentElement.children);
    childrenArray.forEach((child) => {
      child.addEventListener("touchend", (e) => {
        // why currentTarget instead of target?
        this.showOneTodo(e.currentTarget.dataset.name);
      });
    });
  }
}
