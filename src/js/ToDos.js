import { readFromLS, writeToLS } from "./ls.js";
import { qs, createLMNT, setFooter, onTouch } from "./utilities.js";

// // make some waves.
// var ocean = document.getElementById("ocean"),
//     waveWidth = 10,
//     waveCount = Math.floor(window.innerWidth/waveWidth),
//     docFrag = document.createDocumentFragment();

// for(var i = 0; i < waveCount; i++){
//   var wave = document.createElement("div");
//   wave.className += " wave";
//   docFrag.appendChild(wave);
//   wave.style.left = i * waveWidth + "px";
//   wave.style.AnimationDelay = (i/100) + "s";
// }
// ocean.appendChild(docFrag);

let todoList = [];
const listkey = 'items';
var customtasks = [
    "Push changes to github more often, whenever something is working, commit and push it. You never know when something might go wrong...it's better to be safe with a backup than sorry."
];

export default class Todolist {
    // a class needs a constructor
    constructor(parentId) {
        this.taskCount = 0;
        this.parentId = parentId;
        this.listname = listkey;
        this.todoList = [];
        this.todo_error = 'text set in constructor';
        //this.sort = this.sortItems();
        this.sortval = 'time';
        this.filter = 'all';
        this.searchTerm = qs('#srchinput');
        this.srchbtn = qs('#srchbtn');
        this.allbtn = qs('#allbtn');
        this.pendbtn = qs('#pendbtn');
        this.donebtn = qs('#donebtn');
        this.addbtn = qs('#addbtn');
        this.srchbtn2 = qs('#srchbtn2');
        //this.srchbtn = onTouch(this.srchbtn, () => this.listFiltered());
        this.srchbtn.addEventListener('click', () => { this.listFiltered(); }, false);
        this.srchbtn2.addEventListener('click', () => { this.listFiltered(); }, false);
        //this.addbtn.onTouch(), this.addTodo();
        this.addbtn.addEventListener('click', () => { this.addTodo(); }, false);
        this.allbtn.addEventListener('click', () => { this.listAll(); }, false);
        this.pendbtn.addEventListener('click', () => { this.listPending(); }, false);
        this.donebtn.addEventListener('click', () => { this.listDone(); }, false);
    }

    // TODO:  add functionality to choose from listnames or just filter on category?
    async listAll() {
        this.todolist = await this.getList(this.listname, 'all', this.sortval);
        this.renderTodoList(this.todoList, 'todos');
        this.itemsLeft('all');
        console.log('end of listAll()');
    }

    async getList(listname) {
        this.todoList = await getTodos(listname);        
    }

    async listPending() {
        this.todolist = await this.getList(this.listname, 'pending', this.sortval);
        console.log(this.todoList);
        this.todoList = this.todoList.filter(el => !el.done);
        console.log(this.todoList);
        this.renderTodoList(this.todoList, 'todos');
        this.itemsLeft('pending');
        console.log('end of listPending()');
    }

    async listDone() {
        this.todolist = await this.getList(this.listname, 'done', this.sortval);
        this.todoList = this.todoList.filter(el => el.done);
        this.renderTodoList(this.todoList, 'todos');
        this.itemsLeft('done');
        console.log('end of listDone()');
    }

    async listFiltered() {
        this.todolist = await this.getList(this.listname, this.filter, this.sortval);
        this.searchTerm = qs("#srchinput").value;
        let newlist = [];
        this.todoList.forEach((field) => {
            if (field.task.includes(this.searchTerm)) {
                newlist.push(field);
            }
        });
        // Save filtered list to property
        this.todoList = newlist;
        // Sort the list
        let sortedlist = this.sortList(newlist);
        console.log(sortedlist);
        // Display filtered and sorted list
        this.renderTodoList(sortedlist, 'todos');
        // Show item stats for filtered list
        this.itemsLeft(this.searchTerm);
    }

    // sortItems() {
    //     // Get list of sort terms
    //     this.sort = Array.from(document.querySelectorAll('input[name="sort"]'));
    //     console.log(this.sort);
    //     this.sort.forEach(el => {
    //         el.addEventListener('change', () => {
    //             if (el.checked) {
    //                 this.sortval = el.value;
    //                 this.listPending();
    //             }
    //         });
    //     });
    // }

    // function to show how many items are in the current todo list
    itemsLeft(filter) {
        const itemcount = this.todoList.length;
        let t;
        if (itemcount === 1) {
          t = ' list item ';
        } else if ((itemcount > 1) || (itemcount === 0)) {
          t = ' list items ';
        }
        filter = this.filter;
        //console.log(`inside itemsLeft, line 81, this.filter: ${this.filter}`);
        let tasktext = filter;
        let done = this.todoList.filter(item => item.done === true).length;
        let pending = (itemcount - done);
        switch (filter) {
            case ('all'):
                tasktext = 'Pending: ' + pending +  t + ', Done: ' + done + t;
                this.allbtn.classList.add('todobordered');
                this.srchbtn.classList.remove('todobordered');
                this.pendbtn.classList.remove('todobordered');
                this.donebtn.classList.remove('todobordered');
                break;

            case ('pending'):
                tasktext = `Pending: ${pending} ${t}`;
                this.pendbtn.classList.add('todobordered');
                this.allbtn.classList.remove('todobordered');
                this.pendbtn.classList.remove('todobordered');
                this.donebtn.classList.remove('todobordered');
                break;

            case ('done'):
                tasktext = `Done: ${done} ${t}`;
                this.donebtn.classList.add('todobordered');
                this.allbtn.classList.remove('todobordered');
                this.pendbtn.classList.remove('todobordered');
                this.srchbtn.classList.remove('todobordered');
                break;

            default:
                tasktext = `Search: ${itemcount} ${t} found for "${filter}"`;
                this.srchbtn.classList.add('todobordered');
                this.allbtn.classList.remove('todobordered');
                this.pendbtn.classList.remove('todobordered');
                this.donebtn.classList.remove('todobordered');
                break;
        }
        qs("#tasks").innerHTML = tasktext;
        setFooter();
    }

    addCustomTodos = () => {
        // function to add Custom todos to the todo list from an array of objects
        // TODO: get from JSON file or API or firebase/mongodb
        let runlist = false;
        let mytasks = getTodos(this.listname);
        if (mytasks.length == 0) { runlist = true; }
        if (runlist) {
            customtasks.forEach(citem => {
                // loop through list from variable and add to localStorage
                // be sure item is not null/blank, if so, give user a message to enter some text
                if (!citem.length > 0) {
                    let cat = 'From custom todos'
                    this.todo_error = 'Item cannot be blank, there is an error in the input file.';
                    qs("#todo-error").innerText = this.todo_error;
                } else {
                    // check if task is not already in the list
                    let match = customtasks.filter((citem) => (citem.task === citem));
                    // add new item if "citem" is not already in the storage "items"
                    if (match = [] || match == null) {
                        saveTodo(cat, citem, this.listname, this.sortval);
                        customtasks = customtasks.filter((citem) => (!citem.task === citem));
                    }
                    this.listAll();
                }
            })
            runlist = false;
        }
    }

    addTodo() {
        // set error message
        //console.log("inside addTodo");
        // Clear error message
        this.todo_error = '';
        // Get current error message
        qs("#todo-error").innerText = this.todo_error;
        // grab todo from input field
        const task = qs("#addinput");
        let category = qs("#catinput").value;
        console.log(`category: ${category}`);
        if (category.length == 0) {
            category = 'General';
        } else {
            this.taskCount++;
            if (this.taskCount < 9) {
                category += '-0' + this.taskCount.toString();
            } else {
                category += '-' + this.taskCount.toString();          
            }
        }
        console.log(`category: ${category}`);
        if (task.length == 0) { task.push('Custom to do list item'); }
        if (!task.value.length > 0) {
            this.todo_error = 'Item cannot be blank, please enter your todo.';
            qs("#todo-error").innerText = this.todo_error;
        } 
        else if (!task.value.length > 5) {
            this.todo_error = 'Item must be longer than 5 characters, please enter your todo.';
            qs("#todo-error").innerText = this.todo_error;
        } 
        else {
        console.log("inside addTodo, just before saveTodo");
        console.log(`category: ${category}`);
        console.log(`task.value: ${task.value}`);
        //console.log(`this.listname: ${this.listname}`);
            saveTodo(category, task.value); 
            qs("#addinput").value = '';
        }
        this.listAll();
    }

    renderTodoList(renderlist, parentElName) {
        console.log('just inside renderTodoList');
        // build new display
        const parentEl = qs(`#${parentElName}`);
        parentEl.innerText = '';
        console.log(renderlist);
        renderlist.forEach((field) => {
            // create new list item
            //                   createLMNT(LMNT, LMNTtype, LMNTid, LMNTtext, LMNTclass)
            let item = createLMNT('div', '', field.id, '', 'listitem nodots');            
            let itemtext = createLMNT("p", "", "", `${field.category}: ${field.task}`, "todo-text task");
            //let markbox = createLMNT('label', `lbl${field.id}`, '', '', 'bordered markbtn');
            let markbtn = createLMNT("input", "checkbox", `mark${field.id}`, "", "itembtns markbtn chkbtn"); //  "✕"
            let delbtn = createLMNT("button", "button", `del${field.id}`, "✕", "btns itembtns delbtn chkbtn");
            let editbtn = createLMNT("button", "button", `edit${field.id}`, "Edit", "btns itembtns editbtn chkbtn");
            //let editicon = createLMNT("img", "", "", "", "editicon");
            //editicon.setAttribute('src', '../img/icons8-edit-30.png');

            // Done tasks show as "scratched out or lined out"
            if (field.done === true) {
                itemtext.classList.add("todo-scratch");
                markbtn.classList.add('markbtnX');
                markbtn.checked = true;
            } else {
                markbtn.checked = false;
                markbtn.classList.remove('markbtnX');
                itemtext.classList.remove("todo-scratch");
            }
            //editbtn.appendChild(editicon);
            //markbox.appendChild(markbtn);
            //task.appendChild(cattext);
            //task.appendChild(itemtext);

            item.appendChild(markbtn);
            item.appendChild(itemtext);
            item.appendChild(delbtn);
            item.appendChild(editbtn);
            parentEl.appendChild(item);
        });
        this.checkBtn();
    }

    checkBtn() {
        let btnitems = Array.from(document.querySelectorAll('.chkbtn'));
        btnitems.forEach((item) => {
            item.addEventListener('click', function(e) {
                const btnid = e.target.getAttribute('id');
                //console.log(`this.listname, line 225: ${this.listname}`);
                // check if the event is a checkbox
                if (e.target.type === 'checkbox') {
                    // get id from button id value and toggle the state
                    markDone(btnid);
                    this.listAll();
                }
                // check if that is a delete-button
                if (e.target.classList.contains('delbtn')) {
                    // get id from button id value and delete it
                    let btnidsub = btnid.substring(3, btnid.length);
                    console.log(`btnidsub: ${btnidsub}`);
                    //console.log(`this.listname: ${this.listname}`);
                    deleteTodo(btnidsub);
                    this.listAll();
                }
                if (e.target.classList.contains('editbtn')) {
                    // get id from button id value and use it to find the item to edit
                    let btnidsub = btnid.substring(4, btnid.length);
                    //console.log(`btnidsub: ${btnidsub}`)
                    editTodo(btnidsub);
                    this.listAll();
                }
            });
        });
    }

    sortList(list) { 
        console.log(this.sortval);       
        if (this.sortval === "alpha") {
            list.sort(function(a, b) {
                if (a.task < b.task) { return -1; }
                if (a.task > b.task) { return 1; }
                return 0;
            });
        } 
        else if (this.sortval === "time") {
            list.sort(function(a, b) {
                if (a.id < b.id) { return -1; }
                if (a.id > b.id) { return 1; }
                return 0;
            });
        } 
        // else if (this.sortval === "cat") {
        //     list.sort(function(a, b) {
        //         if (a.cat < b.cat) { return -1; }
        //         if (a.cat > b.cat) { return 1; }
        //         return 0;
        //     });
        // }
    }
}

/*  END OF CLASS  */

function getTodos(listkey) {
    return JSON.parse(readFromLS(listkey)) || [];
}

function saveTodo(cat, todo) {
    // read current todo list from local storage
    console.log(`listkey: ${listkey}`)
    let todoList = getTodos(listkey);
    // build todo object
    const newItem = { id: `${Date.now()}`, task: todo, done: false, category: cat };  // prequel for task: todo.length + " " +
    // add obj to todoList
    todoList.push(newItem);
    // save JSON.stringified list to ls
    writeToLS(listkey, JSON.stringify(todoList));
}

// TODO: Categories as field in db, create way to edit category also
function editTodo(id) {
    let todoList = getTodos(listkey);
    let item = todoList.find(el => el.id === id);
    let newtask = prompt("Edit task", item.task);
    if (newtask !== null) {
        item.task = newtask;
        writeToLS(listkey, JSON.stringify(todoList));
    }
    location.reload();
}

function markDone(id) {
    todoList = getTodos(listkey);
    todoList.forEach(function(item) {
        // use == (not ===) because here types are different. One is number and other is string
        if (`mark${item.id}` == id) {
          // toggle the value
          item.done = !item.done;
        }
    });
    // save modified JSON.stringified list to ls
    writeToLS(listkey, JSON.stringify(todoList));
    location.reload();
}

function deleteTodo(id) {
    // console.log(`id: ${id}`)
    // console.log(`listkey: ${listkey}`)
    todoList = getTodos(listkey);
    const filtered = todoList.filter(item => item.id != id);
    // save JSON.stringified list to ls
    writeToLS(listkey, JSON.stringify(filtered));
    location.reload();
}
