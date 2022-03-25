import * as ls from "./ls.js";
import * as util from "./utilities.js";

let todoList = [];
//const lskey = 'items';
var customtasks = [
    "Push changes to github more often, whenever something is working, commit and push it. You never know when something might go wrong...it's better to be safe with a backup than sorry."
];

export default class todos {
    // a class needs a constructor
    constructor(parentId) {
        this.parentId = parentId;
        this.todoList = [];
        this.todo_error = error;
        this.sort = Array.from(document.querySelectorAll('input[name="sort"]'));
        this.sortval = this.sortItems();
        this.searchWord = util.qs('#searchinput');
        this.srchbtn = util.qs('#srchbtn');
        this.allbtn = util.qs('#allbtn');
        this.actbtn = util.qs('#actbtn');
        this.donebtn = util.qs('#donebtn');
        this.addbtn = util.qs('#addbtn');
        this.srchbtn2 = util.qs('#srchbtn2');
        this.srchbtn.addEventListener("touchend", () => { this.listFiltered(); }, false);
        this.srchbtn2.addEventListener("touchend", () => { this.listFiltered(); }, false);
        this.addbtn.addEventListener("touchend", () => { this.addTodo(); }, false);
        this.allbtn.addEventListener("touchend", () => { this.listAll(); }, false);
        this.actbtn.addEventListener("touchend", () => { this.listActive(); }, false);
        this.donebtn.addEventListener("touchend", () => { this.listDone(); }, false);
    }

    async listAll() {
        console.log(this.sortval);
        this.todoList = await getTodos('items', this.sortval);
        this.renderTodoList(this.todoList, 'todos');
        this.itemsLeft('All');
    }

    sortItems() {
        console.log(this.sort);
        this.sort.forEach(el => {
            el.addEventListener('change', () => {
                if (el.checked) {
                    console.log(el.value, el.checked);
                    this.sortval = el.value;
                    this.listAll();
                    console.log('sorted by ' + this.sortval);
                }
            });
        });
    }

    // function to show how many items are in the current todo list
    itemsLeft(filter) {
        const itemcount = this.todoList.length;
        let t;
        if (itemcount === 1) {
          t = ' todo ';
        } else if ((itemcount > 1) || (itemcount === 0)) {
          t = ' todos ';
        }
        let tasktext = filter;
        let done = this.todoList.filter(item => item.done === true).length;
        let pending = (itemcount - done) + ' ' + t + ', ';
        switch (filter) {
            case ('All'):
                tasktext += ', <br> Pending:' + pending + ', Done: ' + done + ' ' + t;
                this.allbtn.classList.add('todobordered');
                this.srchbtn.classList.remove('todobordered');
                this.actbtn.classList.remove('todobordered');
                this.donebtn.classList.remove('todobordered');
                break;

            case ('Active'):
                tasktext += `: Pending: ${itemcount} ${t}`;
                this.actbtn.classList.add('todobordered');
                this.allbtn.classList.remove('todobordered');
                this.actbtn.classList.remove('todobordered');
                this.donebtn.classList.remove('todobordered');
                break;

            case ('Done'):
                tasktext += `:  ${t} ${done} done`;
                this.donebtn.classList.add('todobordered');
                this.allbtn.classList.remove('todobordered');
                this.actbtn.classList.remove('todobordered');
                this.srchbtn.classList.remove('todobordered');
                break;

            default:
                tasktext = `Search: ${itemcount} ${t} found for "${filter}"`;
                this.srchbtn.classList.add('todobordered');
                this.allbtn.classList.remove('todobordered');
                this.actbtn.classList.remove('todobordered');
                this.donebtn.classList.remove('todobordered');
                break;
        }
        util.qs("#tasks").innerHTML = tasktext;
        util.setFooter();
    }

    addCustomTodos = () => {
        // function to add Custom todos to the todo list from an array of objects
        // todo: get from JSON file or API or database
        let runlist = false;
        // TODO: add function to retrieve from firebase
        let mytasks = getTodos('items', this.sortval);
        //console.log(mytasks);
        if (mytasks.length == 0) { runlist = true; }
        if (runlist) {
            customtasks.forEach(citem => {
                // loop through list from variable and add to localStorage
                // be sure item is not null/blank, if so, give user a message to enter some text
                if (!citem.length > 0) {
                    this.todo_error = 'Item cannot be blank, there is an error in the input file.';
                    util.qs("#error").innerText = this.todo_error;
                } else {
                    // check if task is not already in the list
                    let match = customtasks.filter((citem) => (citem.task === citem));
                    // add new item if "citem" is not already in the storage "items"
                    if (match = [] || match == null) {
                        saveTodo(citem, 'items');
                        customtasks = customtasks.filter((citem) => (!citem.task === citem));
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
        if (task.length == 0) { task.push('Custom to do list item'); }
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
            //                   createLMNT(LMNT, LMNTtype, LMNTid, LMNTtext, LMNTclass)
            let item = util.createLMNT('li', '', '', '', 'listitem todo-bordered nodots');
            //console.log(field.task.length, field.task);
            let itemtext = util.createLMNT("p", "", "", `${field.task} ${field.id}` , "todo-text");
            let markbox = util.createLMNT('label', `label${field.id}`, '', '', 'bordered markbtn');
            let markbtn = util.createLMNT("input", "checkbox", field.id, "✕", "markbtn chkbtn");
            let delbtn = util.createLMNT("button", "button", `del${field.id}`, "X", "delbtn chkbtn");
            let editbtn = util.createLMNT("button", "button", `edit${field.id}`, "", "editbtn chkbtn");
            let editicon = util.createLMNT("img", "", "", "", "editicon");
            editicon.setAttribute('src', '../img/icons8-edit-30.png');

            if (field.done === true) {
                itemtext.classList.add("todo-scratch");
                markbtn.classList.add('markbtnX');
                markbtn.checked = true;
            } else {
                markbtn.checked = false;
                markbtn.classList.remove('markbtnX');
                itemtext.classList.remove("todo-scratch");
            }
            editbtn.appendChild(editicon);
            markbox.appendChild(markbtn);
            item.appendChild(markbox);
            item.appendChild(itemtext);
            item.appendChild(delbtn);
            item.appendChild(editbtn);
            parentEl.appendChild(item);
        });
        this.checkBtn();
    }

    checkBtn() {
        let btnitems = Array.from(document.querySelectorAll('.chkbtn'));
        //console.log(btnitems);
        btnitems.forEach(function (item) {
            item.addEventListener('touchend', function(e) {
                let btnid = e.target.getAttribute('id');
                console.log(btnid);
                // check if the event is a checkbox
                if (e.target.type === 'checkbox') {
                    // get id from button id value and toggle the state
                    markDone(btnid);
                    this.listActive();
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
                if (e.target.classList.contains('editbtn')) {
                    // get id from button id value and delete it
                    btnid = btnid.substring(4, btnid.length);
                    console.log(btnid);
                    //console.log(e.target.getAttribute('id').substring(3, id.length));
                    editTodo(btnid);
                    this.listActive();
                }
                //console.log(item);
            });
        });
    }

    listActive() {
        this.todoList = getTodos('items', this.sortval);
        this.todoList = this.todoList.filter(el => el.done === false);
        this.renderTodoList(this.todoList, 'todos', 'alpha');
        this.itemsLeft('Active');
    }

    listDone() {
        this.todoList = getTodos('items', this.sortval);
        this.todoList = this.todoList.filter(el => el.done === true);
        this.renderTodoList(this.todoList, 'todos');
        this.itemsLeft('Done');
    }

    listFiltered() {
        this.todoList = getTodos('items', this.sortval);
        this.searchWord = util.qs("#srchinput").value;
        console.log(this.searchWord);
        let newlist = [];
        this.todoList.forEach((field) => {
            if (field.task.includes(this.searchWord)) {
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
        this.todoList = newlist;
        this.renderTodoList(newlist, 'todos');
        this.itemsLeft(this.searchWord);
    }
}

/*  END OF CLASS  */

function getTodos(lskey, sort) {
    let mylist = JSON.parse(ls.readFromLS(lskey)) || [];
    if (sort = 'alpha') {
        //mylist = mylist.sort((a, b) => (a.task - b.task));
        mylist.sort(function(a, b) {
            if (a.task < b.task) { return -1; }
            if (a.task > b.task) { return 1; }
            return 0;
        });
        console.log(mylist);
    } else if (sort = 'time') {
        //mylist = mylist.sort((a, b) => (a.id - b.id));
        mylist.sort(function(a, b) {
            console.log(a.id, b.id);
            if (a.id < b.id) { return -1; }
            if (a.id > b.id) { return 1; }
            return 0;
        });
        console.log(mylist);
    } else if (sort = 'cat') {
        //mylist = mylist.sort((a, b) => (a.cat - b.cat));
        mylist.sort(function(a, b) {
            if (a.cat < b.cat) { return -1; }
            if (a.cat > b.cat) { return 1; }
            return 0;
        });
        console.log(mylist);
    }
    return mylist;
}

function saveTodo(todo) {
    todoList = getTodos('items');
    // build todo object
    const newItem = { id: `${Date.now()}`, task: todo, done: false };  // prequel for task: todo.length + " " +
    // add obj to todoList
    todoList.push(newItem);
    // save JSON.stringified list to ls
    ls.writeToLS('items', JSON.stringify(todoList));
}

function editTodo(id) {
    let todoList = getTodos('items');
    let item = todoList.find(el => el.id === id);
    console.log(item);
    let newtask = prompt("Edit task", item.task);
    if (newtask !== null) {
        item.task = newtask;
        ls.writeToLS('items', JSON.stringify(todoList));
    }
}

function markDone(id) {
    console.log(id);
    todoList = getTodos('items');
    todoList.forEach(function(item) {
        // use == (not ===) because here types are different. One is number and other is string
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
    todoList = getTodos('items', 'time');
    const filtered = todoList.filter(item => item.id != id);
    // save JSON.stringified list to ls
    ls.writeToLS('items', JSON.stringify(filtered));
    console.log(filtered);
    console.log(todoList);
    location.reload();
}
