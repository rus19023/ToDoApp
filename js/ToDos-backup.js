import * as ls from "./ls.js";
import * as util from "./utilities.js";

let todoList = [];

export default class ToDos {
  // a class needs a constructor
  constructor(parentId, lskey) {
    this.parentId = parentId;
    this.parentEl = util.qs(`#${this.parentId}`);
    this.lskey = lskey;
    this.todoList = [];
    this.todo_error = "";
    util.onTouch("#addbtn", this.addTodo);
    util.onTouch("#allbtn", this.listAll);
    util.onTouch("#actbtn", this.listActive);
    util.onTouch("#donebtn", this.listDone);
  }

  addTodo() {
    // set blank error field
    util.qs("#todo-error").innerText = this.todo_error;
    console.log(this.todo_error);
    // grab task from input field
    const task = util.qs("#addinput").value;
    if (!task.length > 0) {
      this.todo_error = "Item cannot be blank, please enter your task.";
      util.qs("#todo-error").innerText = this.todo_error;
    } else {
      this.todo_error = "";
      console.log(this.lskey);
      saveTodo(task, this.lskey);
    }
    this.todoList = getTodos(this.lskey);
    console.log(this.todoList);
    this.listAll;
  }

  listAll() {
    console.log(this.lskey);
    this.todoList = getTodos(this.lskey);
    console.log(this.todoList);
    this.renderTodoList(this.todoList);
    this.itemsLeft();
  }

  listActive() {
    this.todoList = getTodos(this.lskey);
    this.renderTodoList(this.todoList.filter((el) => el.done === false));
    this.itemsLeft();
  }

  listDone() {
    this.todoList = getTodos(this.lskey);
    this.renderTodoList(this.todoList.filter((el) => el.done === true));
    this.itemsLeft();
  }

  // function to show how many items are left undone in the todo list
  itemsLeft() {
    let itemcount = this.todoList.length;
    //console.log(itemcount);
    let t;
    if (itemcount === 1) {
      t = " task ";
    } else if (itemcount > 1 || itemcount == 0) {
      t = " tasks ";
    }
    util.qs("#tasks").innerText = `${itemcount} ${t} left`;
  }

  renderTodoList(renderlist) {
    // build new display
    //const parentEl = util.qs('#todos');
    this.parentEl.innerText = "";
    renderlist.forEach((field) => {
      // create new list item
      //            createLMNT(LMNT, LMNTtype, LMNTid, LMNTtext, LMNTclass)
      let item = util.createLMNT(
        "li",
        "",
        `item${field.id}`,
        "",
        "listitem bordered item-row"
      );
      let itemtext = util.createLMNT("p", "", "", field.task, "todo-text");
      let markbox = util.createLMNT("label", "", "", "", "bordered markbtn");
      //markbox.setAttribute('name', `label${field.id}`);
      let markbtn = util.createLMNT("input", "checkbox", field.id, "", "");
      let delbtn = util.createLMNT(
        "button",
        "",
        `del${field.id}`,
        "X",
        "delbtn"
      );
      //console.log(item);
      markbox.addEventListener("click", this.markDone(field.id));
      delbtn.addEventListener("click", this.deleteItem(field.id));
      //console.log(`#del${field.id}`);
      //console.log(field.id)
      //util.onTouch(`#del${field.id}`, deleteItem(field.id));
      //util.onTouch(`#mark${field.id}`, markDone(field.id));

      if (field.done === true) {
        itemtext.classList.add("scratch");
        markbtn.classList.add("markbtnX");
        markbtn.checked = true;
      }
      markbox.appendChild(markbtn);
      item.appendChild(markbox);
      item.appendChild(itemtext);
      item.appendChild(delbtn);
      //console.log('bottom of renderTodoList, parentEl: ' + parentEl);
      this.parentEl.appendChild(item);
    });
  }

  markDone(id) {
    this.todoList = getTodos(this.lskey);
    this.todoList.forEach((item) => {
      if (item.id === `item${id}`) {
        console.log("item: " + item);
        item.done = true;
        console.log("item: " + item);
      }
    });
    ls.writeToLS(lskey, JSON.stringify(this.todoList));
    //markItemDone(lskey, id);
    console.log("this.todoList: " + this.todoList);
    this.listAll();
  }

  deleteItem(id) {
    //console.log("todoList: " + todoList);
    // get the index of the item with this id
    const gotindex = this.todoList.findIndex((todo) => todo.id === id);
    // set the boolean to true for this list item
    //todoList[gotindex] = { id: todo.id, task: todo.task, done: true };
    // add obj to todoList
    this.todoList.splice(gotindex, 1);
    // save JSON.stringified list to ls
    //ls.writeToLS(this.lskey, JSON.stringify(this.todoList));
  }
}

/***** END OF CLASS *****/

/*
In the Todo.js module, but not in the Todos class, create the following function
/* build a todo object, add it to the todoList, and save the new list to local storage.
@param {string} key The key under which the value is stored under in LS @param {string} task The text of the task to be saved.
A todo should look like this: { id : timestamp, content: string, completed: bool }
*/

function saveTodo(task, lskey) {
  console.log(lskey);
  todoList = getTodos(lskey);
  console.log(todoList);
  // build todo object
  const todo = { id: Date.now(), task: task, done: false };
  // add obj to todoList
  todoList.push(todo);
  console.log(todoList);
  // save JSON.stringified list to ls
  ls.writeToLS(lskey, JSON.stringify(todoList));
  console.log("todo added!");
}

function getTodos(lskey) {
  console.log(lskey);
  let tasklist = ls.readFromLS(lskey);
  console.log(`tasklist from getTodos: ${tasklist}`);
  console.log(ls.readFromLS(lskey));
  console.log(`tasklist from getTodos: ${tasklist}`);
  return tasklist || [];
}

export { saveTodo, getTodos };
