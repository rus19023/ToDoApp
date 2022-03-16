import * as ls from "./ls.js";
import * as util from "./utilities.js";

let todoList = [];
//const lskey = 'items';
var dtasks = [
    "Push changes to github more often, whenever something is working, commit and push it. You never know when something might go wrong...it's better to be safe with a backup than sorry.",
    "Overall css: change the red color to one in your color scheme, maybe the blue with white text?",
    "Home navbar item: I think it should not go to login screen if already logged in. Maybe to the shopping page? or a splash page with company / product / services info?",
    "Login screen: should only show if not logged in. (Probably have to set up authentication to do that. I think I gave you a link for that?)",
    "For shopping cart page: It needs an order total. ",
    "For shopping cart page: Change Confirm Order button to Continue (the order isn't really ready for confirmation at this stage, it still needs the shipping and billing info, including payment card info).",
    "For shopping cart page: I would also move the Continue and Return to Shopping buttons more to the right, maybe near the subtotal column.",
    "For shopping cart page: Less horizontal and vertical space between line items.",
    "For shopping cart page: Smaller box for quantity.",
    "For order history page: It needs a button to place an order.",
    "For Current Order confirmation page: Maybe needs to be renamed Shipping / Billing info?",
    "For Current Order confirmation page: Also needs the order total.",
    "For Current Order confirmation page: Form validation should not allow empty shipping/billing addresses. <a href='https://www.freecodecamp.org/news/how-to-make-input-validation-simple-and-clean-in-your-express-js-app-ea9b5ff5a8a7/>form validation article</a>",
    "For Current Order confirmation page: Add card / payment info, which also should not be allowed to be blank.",
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

    async listAll() {
        this.allbtn.classList.add('showborder');
        this.todoList = await getTodos('items');
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

    addSampleTodos = () => {
        // todo: get from JSON file or API or database
        let runlist = false;
        let mytasks = getTodos('items');
        //console.log(mytasks);
        if (mytasks.length == 0) { runlist = true; }
        if (runlist) {
            dtasks.forEach(ditem => {
                // loop through list from variable and add to localStorage
                //console.log(dtasks);
                //console.log(ditem);
                // be sure item is not null/blank, if so, give user a message to enter some text
                if (!ditem.length > 0) {
                    this.todo_error = 'Item cannot be blank, please enter your todo.';
                    util.qs("#error").innerText = this.todo_error;
                } else {
                    // check if task is not already in the list
                    let match = dtasks.filter((item) => (item.task === ditem));
                    //console.log(ditem);
                    //console.log(match);
                    // add new item if "ditem" is not already in the storage "items"
                    if (match = [] || match == null) {
                        saveTodo(ditem, 'items');
                        let matchit = getTodos('items');
                        //console.log(matchit);
                        dtasks = dtasks.filter((item) => (!item.task === ditem));
                        //console.log(dtasks);
                    }
                    this.listAll();
                }
            })
            runlist = false;
        }
    }

    addTodo() {
        // clear error message
        this.todo_error = '';
        util.qs("#error").innerText = this.todo_error;
        // grab todo from input field
        const task = util.qs("#addinput");
        //console.log(task);
        if (task.length == 0) { task.push('sample to do list item'); }
        //console.log(task);
        if (!task.value.length > 0) {
            this.todo_error = 'Item cannot be blank, please enter your todo.';
            util.qs("#error").innerText = this.todo_error;
        } else {
            saveTodo(task.value, 'items');
            util.qs("#addinput").value = '';
            this.listAll();
        }
    }

    renderTodoList(renderlist, parentElName) {
        //console.log(parentElName);
        // build new display
        const parentEl = util.qs(`#${parentElName}`);
        //console.log(parentEl);
        parentEl.innerText = '';
        renderlist.forEach((field) => {
          // create new list item
          //            createLMNT(LMNT, LMNTtype, LMNTid, LMNTtext, LMNTclass)
          let item = util.createLMNT('li', '', '', '', 'listitem todo-bordered item-row nodots');
          //console.log(field.task.length, field.task);
          let itemtext = util.createLMNT("p", "", "", field.task , "todo-text");
          let markbox = util.createLMNT('label', `label${field.id}`, '', '', 'bordered markbtn');
          markbox.setAttribute('name', `label${field.id}`);
          let markbtn = util.createLMNT("input", "checkbox", field.id, "", "markbtn chkbtn");
          let delbtn = util.createLMNT("button", "button", `del${field.id}`, "X", "delbtn chkbtn");
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
                let btnid = e.target.getAttribute('id');
                console.log(btnid);
                // check if the event is a checkbox
                if (e.target.type === 'checkbox') {
                    // get id from button id value and toggle the state
                    markDone(btnid);
                    this.listAll;
                }
                // check if that is a delete-button
                if (e.target.classList.contains('delbtn')) {
                    // get id from button id value and delete it
                    btnid = btnid.substring(3, btnid.length);
                    console.log(btnid);
                    //console.log(e.target.getAttribute('id').substring(3, id.length));
                    deleteTodo(btnid);
                    this.listAll();
                }
                //console.log(item);
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
        const searchitem = util.qs('#srchinput').value;
        //console.log(searchitem);
        let newlist = [];
        this.todoList.forEach((field) => {
            if (field.task.includes(searchitem)) {
                //console.log(field);
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

/*  END OF CLASS  */

function getTodos(lskey) {
    let todolist = JSON.parse(ls.readFromLS(lskey)) || [];
    return todolist;
}

function saveDTodo(todo) {
    let taskList = getTodos('items');
    console.log(todo);
    // build todo object
    const newItem = { id: Date.now(), task: todo, done: false };
    console.log(newItem);
    // add obj to todoList
    taskList.push(newItem);
    //console.log(taskList);
    // save JSON.stringified list to ls
    ls.writeToLS('items', JSON.stringify(taskList));
}

function saveTodo(todo) {
    todoList = getTodos('items');
    // build todo object
    const newItem = { id: Date.now(), task: todo, done: false };  // prequel for task: todo.length + " " +
    // add obj to todoList
    todoList.push(newItem);
    // save JSON.stringified list to ls
    ls.writeToLS('items', JSON.stringify(todoList));
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
    location.reload();
}

function deleteTodo(id) {
    todoList = getTodos('items');
    const filtered = todoList.filter(item => item.id != id);
    // save JSON.stringified list to ls
    ls.writeToLS('items', JSON.stringify(filtered));
    console.log(filtered);
    console.log(todoList);
    location.reload();
}
