import * as ls from "./ls.js";
import * as util from "./utilities.js";

var todoList = null;

export default class ToDos {
  // a class needs a constructor
  constructor(parentId) {
    this.addbtn = util.createLMNT("button", "button", "addbtn", "+", "");
    util.onTouch("#addbtn", this.addTodo);
    this.parentElement = util.qs(`#${parentId}`);
  }

  listTodos() {
    // get list of todos from local storage and send them to the render function
    todoList = getTodos("items");
    let mytask = [];
    todoList.forEach((todo) => {
      // add this todo to the list;
      mytask.push(todo);
    });
    renderTodoList(this.parentElement, todoList);
    this.itemsLeft();
  }

  addTodo() {
    // grab task from input field
    const task = util.qs("#addinput").value;
    saveTodo(task, "items");
    this.listTodos();
  }

  removeTodo() {
    const taskid = util.qs();
    this.todoList = getTodos("items");

    this.listTodos();
  }

  markItem() {
    this.listTodos();
  }

  filterTodos(list, filterstring) {
    //   console.log(numbers.filter(x => x%2 === 0 ));
    console.log(`filterTodos list before filtering: ${list}`);
    console.log(list.filter((item) => item.lskey === filterstring));
    return list.filter((item) => item.lskey === filterstring);
  }

  listActive(list) {
    renderTodoList(this.parentElement, filterTodos(list, false));
  }

  listDone(list) {
    renderTodoList(this.parentElement, filterTodos(list, true));
  }

  // function to show how many items are left undone in the todo list
  itemsLeft() {
    let items = todoList.length;
    if (items === 1) {
      util.qs("#tasks").innerText = items + " task left";
    } else if (items < 2 && items > 0) {
      util.qs("#tasks").innerText = items + " tasks left";
    }
  }
}

/*
In the Todo.js module, but not in the Todos class, create the following function
/* build a todo object, add it to the todoList, and save the new list to local storage.
@param {string} key The key under which the value is stored under in LS @param {string} task The text of the task to be saved.
A todo should look like this: { id : timestamp, content: string, completed: bool }
*/

function saveTodo(task, lskey) {
  let mytasks = getTodos("items");
  console.log("mytasks: " + mytasks);
  // build todo object
  const todo = { id: Date.now(), task: task, done: false };
  // add obj to todoList
  mytasks.push(todo);
  // serialize the list for sending to localStorage
  let mytasklist = JSON.stringify(mytasks);
  // save JSON.stringified list to ls
  ls.writeToLS(lskey, mytasklist);
}

function renderTodoList(parentId, renderlist) {
  renderlist.forEach((field) => {
    // create new list item
    let item, itemtext, markbox, marklabel, markbtn, delbtn, myId;
    myId = `item${field.id}`;
    //            createLMNT(LMNT, LMNTtype, LMNTid, LMNTtext, LMNTclass)
    item = util.createLMNT(
      "li",
      "",
      field.id,
      "",
      "listitem bordered item-row"
    );
    itemtext = util.createLMNT("p", "", "", field.task, "todo-text");
    markbox = util.createLMNT("div", "", `markbox${field.id}`, "", "bordered");
    marklabel = util.createLMNT("label", "", `labl${field.id}`, "", "");
    markbtn = util.createLMNT(
      "input",
      "checkbox",
      `markbtn${field.id}`,
      "",
      "bordered todo-buttons markbtn"
    );
    // add the touchend event to button, if it's touched, mark it done
    util.onTouch("#markbtn", markDone(myId));
    if (field.done === true) {
      itemtext.classList.add("scratch");
      markbtn.innerText = "✕";
    }
    delbtn = util.createLMNT("button", "", "delbtn", "X", " del-text");
    delbtn.onTouch("delbtn", deleteItem(myId));
    markbox.appendChild(markbtn);
    markbox.appendChild(marklabel);
    item.appendChild(markbox);
    item.appendChild(itemtext);
    item.appendChild(delbtn);
    console.log(parentId);
    parentId.appendChild(item);
  });
}

/*
In the Todos.js module, but not in the Todos class create the following function
/ check the contents of todoList, a local variable containing a list of ToDos. If it is null then pull the list of todos from localstorage, update the local variable, and return it
@param {string} key The key under which the value is stored under in LS @return {array} The value as an array of objects */

function getTodos(lskey) {
  return JSON.parse(ls.readFromLS(lskey)) || [];
}

// Mark selected item as completed
function markDone(id) {
  todoList = getTodos("items");
  todoList.forEach((item) => {
    if (item.id === id) {
      item.done = true;
    }
  });
  ls.writeToLS("items", JSON.stringify(todoList));
}

function deleteItem(id) {
  // get list of tasks from localStorage
  let mytasks = getTodos("items");
  console.log("mytasks: " + mytasks);
  // get the index of the item with this id
  const gotindex = mytasks.findIndex((todo) => todo.id === id);
  // set the boolean to true for this list item
  mytasks[gotindex] = { id: todo.id, task: todo.task, done: true };
  // add obj to todoList
  mytasks.push(todo);
  // serialize the list for sending to localStorage
  let mytasklist = JSON.stringify(mytasks);
  // save JSON.stringified list to ls
  ls.writeToLS(lskey, mytasklist);
}

/*
function markDone(id) {
  // get list of tasks from localStorage
  todoList = getTodos('items');
  console.log(todoList);
  // get the index of the item with this id
  const gotindex = todoList.findIndex
  console.log(gotindex);
  let newtodo = { id: id, task: todoList[gotindex].task, done: true };
  // add obj to todoList
  mytasks.splice(gotindex, 1, newtodo);
  // serialize the list for sending to localStorage
  let mytasklist = JSON.stringify(mytasks);
  console.log(mytasklist);
  // save JSON.stringified list to ls
  //ls.writeToLS(lskey, mytasklist);
}
*/
export { saveTodo, renderTodoList, getTodos, deleteItem, markDone };
