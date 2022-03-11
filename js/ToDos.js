import * as ls from "./ls.js";
import * as util from "./utilities.js";

let todoList = [];
//const lskey = 'items';
var dtasks = [
  "Overall css: change the red color to one in your color scheme, maybe the blue with white text?",
  "Home navbar item: I think it should not go to login screen if already logged in. Maybe to the shopping page? or a splash page with company/product/services info?",
  "Login screen: should only show if not logged in. (Probably have to set up authentication to do that. I think I gave you a link for that?)",
  "Menu item Shopping Category: gives page that says Shopping Categories, I think that should be another page, similar to Shopping Category in the menu, but with the medicine categories instead of the single medicines, with each category going to a page with all the medicines for just that one category. (I believe we started working on this?)",
  "For shopping cart page: It needs an order total. ",
  "For shopping cart page: Change Confirm Order button to Continue (the order isn't really ready for confirmation at this stage, it still needs the shipping and billing info, including payment card info).",
  "For shopping cart page: I would also move the Continue and Return to Shopping buttons more to the right, maybe near the subtotal column.",
  "For shopping cart page: Less horizontal and vertical space between line items.",
  "For shopping cart page: Smaller box for quantity.",           
  "For Current Order confirmation page: Maybe needs to be renamed Shipping/Billing info?",
  "For Current Order confirmation page: Also needs the total.",
  "For Current Order confirmation page: Should not allow empty shipping/billing addresses. I suggest making a database table for addresses, then they can be saved so the client won't have to type them again.",
  "For Current Order confirmation page: Add card/payment info, which also should not be allowed to be blank.",
  "Rename submit button to confirm order button which goes to a new Order Confirmation page."
];

export default class todos {
    // a class needs a constructor
    constructor(parentId) {
        this.parentId = parentId;
        this.todoList = [];
        this.todo_error = error;
        this.searchWord = util.qs('#searchinput');
        this.srchbtn = util.qs('#srchbtn');
        this.allbtn = util.qs('#allbtn');
        this.actbtn = util.qs('#actbtn');
        this.donebtn = util.qs('#donebtn');
        this.addbtn = util.qs('#addbtn');
        this.srchbtn.addEventListener("touchend", () => { this.listFiltered(); }, false);
        this.addbtn.addEventListener("touchend", () => { this.addTodo(); }, false);
        this.allbtn.addEventListener("touchend", () => { this.listAll(); }, false);
        this.actbtn.addEventListener("touchend", () => { this.listActive(); }, false);
        this.donebtn.addEventListener("touchend", () => { this.listDone(); }, false);
  }

  listAll() {
      this.allbtn.classList.add('showborder');
      this.todoList = getTodos('items');
      this.renderTodoList(this.todoList, 'todos');
      this.itemsLeft(this.todoList);
  }

  // function to show how many items are left undone in the todo list
  itemsLeft(list) {
      const itemcount = list.length;
      let t;
      if (itemcount === 1) {
        t = ' todo ';
      } else if ((itemcount > 1) || (itemcount === 0)) {
        t = ' todos ';
      }
      util.qs("#tasks").innerHTML = `${itemcount} ${t} left`;
      util.setFooter();
  }

  addDTodos() { 
      // get list from localStorage
      console.log(dtasks);
      dtasks.forEach(ditem => {        
          //console.log(ditem);
          // be sure item is not null/blank, if so, give user a message to enter some text
          if (!ditem.length > 0) {
              this.todo_error = 'Item cannot be blank, please enter your todo.';
              util.qs("#error").innerText = this.todo_error;
          } else {
              // check if task is not already in the list
              let match = dtasks.filter((item) => (item.task === ditem));
              console.log(ditem);
              console.log(match);
              // add new item if "ditem" is not already in the storage "items"
              if (match = [] || match == null) {
                  saveTodo(ditem, 'items');
                  let matchit = getTodos('items');
                  console.log(matchit);
                  dtasks = dtasks.filter((item) => (!item.task === ditem));
                  console.log(dtasks);
              }
              this.listAll();
          }     
      });
  }

  addTodo() {
      // clear error message
      this.todo_error = '';
      util.qs("#error").innerText = this.todo_error;
      // grab todo from input field
      const task = util.qs("#addinput");
      console.log(task);
      if (task.length == 0) { task.push('sample to do list item'); }
      console.log(task);
      if (!task.value.length > 0) {
          this.todo_error = 'Item cannot be blank, please enter your todo.';
          util.qs("#error").innerText = this.todo_error;
      } else {
          saveTodo(task.value, 'items');
      }
      this.listAll;
  }

  markItem(id) {
      markDone(id);
      this.listAll;
  }

  removeItem(id) {
      deleteTodo(id);
      this.listAll;
  }

  renderTodoList(renderlist, parentElName) {
      console.log(parentElName);
      // build new display
      const parentEl = util.qs(`#${parentElName}`);
      console.log(parentEl);
      parentEl.innerText = '';
      renderlist.forEach((field) => {
        // create new list item
        //            createLMNT(LMNT, LMNTtype, LMNTid, LMNTtext, LMNTclass)
        let item = util.createLMNT('li', '', '', '', 'listitem todo-bordered item-row nodots');

        console.log(field.task.length);
        if (field.task.length > 200) {
          item.style.height = '27vh';
        } else if (field.task.length > 100) {
          item.style.height = '18vh';
        } else if (field.task.length > 75) {
          item.style.height = '15vh';
        } else if (field.task.length > 30) {
          item.style.height = '12vh';
        }
        let itemtext = util.createLMNT("p", "", "", field.task , "todo-text");
        let markbox = util.createLMNT('label', `label${field.id}`, '', '', 'bordered markbtn');
        markbox.setAttribute('name', `label${field.id}`);
        let markbtn = util.createLMNT("input", "checkbox", field.id, "", "markbtn chkbtn");
        let delbtn = util.createLMNT("button", "", `del${field.id}`, "X", "delbtn chkbtn");
        if (field.done === true) {
          itemtext.classList.add("todo-scratch");
          markbtn.classList.add('markbtnX');
          markbtn.checked = true;
        } else {
          markbtn.checked = false;
          markbtn.classList.remove('markbtnX');
          itemtext.classList.remove("todo-scratch");
        }
        markbox.appendChild(markbtn);
        item.appendChild(markbox);
        item.appendChild(itemtext);
        item.appendChild(delbtn);
        parentEl.appendChild(item);
      });
      this.checkBtn();
  }

  checkBtn() {
      let btnitems = Array.from(document.querySelectorAll('.chkbtn'));
      btnitems.forEach(function (item) {
          item.addEventListener('touchend', function(e) {
            // check if the event is a checkbox
            if (e.target.type === 'checkbox') {
              // get id from button id value and toggle the state
              markDone(e.target.getAttribute('id'));
            }
            // check if that is a delete-button
            if (e.target.classList.contains('delbtn')) {
              // get id from button id value and delete it
              deleteTodo(e.target.getAttribute('id'));
            }
            console.log(item);
          });
      });
  }

  listActive() {
      this.actbtn.classList.add('showborder');
      this.todoList = getTodos('items');
      this.todoList = this.todoList.filter(el => el.done === false);
      this.renderTodoList(this.todoList, 'todos');
      this.itemsLeft(this.todoList);
    }

    listDone() {
      this.donebtn.classList.add('showborder');
      this.todoList = getTodos('items');
      this.todoList = this.todoList.filter(el => el.done === true);
      this.renderTodoList(this.todoList, 'todos');
      this.itemsLeft(this.todoList);
    }

    listFiltered() {
        this.todoList = getTodos('items');
        const searchitem = util.qs('#searchinput').value;
        console.log(searchitem);
        let newlist = [];
        this.todoList.forEach((field) => {
            if (field.task.includes(searchitem)) {
                console.log(field);
                newlist.push(field);
            }
        });
        //this.todoList = this.todoList.filter(el => el.task == searchitem);
        // var __FOUND = el.findIndex(function(task, index) {
        //   if(post.title == 'Guava')
        //     return true;
        // });
        console.log(newlist);
        this.renderTodoList(newlist, 'todos');
        this.itemsLeft(this.todoList);
    }
}

/***** END OF todos CLASS *****/

/*
In the todos.js module, but not in the todos class create the following function
/ check the contents of sList, a local variable containing a list of todos. If it is null then pull the list of todos from localstorage, update the local variable, and return it
@param {string} key The key under which the value is stored under in LS @return {array} The value as an array of objects /
function gettodos(key) { }
*/

function getTodos(lskey) {
    let todolist = JSON.parse(ls.readFromLS(lskey)) || [];
  return todolist;
}

function saveTodo(todo, lskey) {
  todoList = getTodos(lskey);
  console.log(todoList);
  // build todo object
  const newItem = { id: Date.now(), task: todo, done: false };
  // add obj to todoList
  todoList.push(newItem);
  console.log(todoList);
  // save JSON.stringified list to ls
  ls.writeToLS(lskey, JSON.stringify(todoList));
}

function markDone(id) {
    todoList = getTodos('items');
    todoList.forEach(function(item) {
        // use == not ===, because here types are different. One is number and other is string
        if (item.id == id) {
          // toggle the value
          item.done = !item.done;
        }
    });
    // save modified JSON.stringified list to ls
    ls.writeToLS('items', JSON.stringify(todoList));
    console.log(todoList);
}

function deleteTodo(id) {
    todoList = getTodos('items');
    todoList = todoList.filter(item => item.id != id.substr(3, id.length));
    // save JSON.stringified list to ls
    ls.writeToLS('items', JSON.stringify(todoList));
}
