// 1. Create DOM manipulation helper functions in utilities.js
//Two here for starters should be good as well...may add more later
// do a querySelector lookup @param {string} selector The selector passed to querySelector

// @return {element} The matching element or null if not found /
const qs = selector => {
    return document.querySelector(selector);
}

/*
add a touchend event listener to an element for mobile with a click event fallback for desktops @param {string} elementSelector The selector for the element to attach the listener to
* @param {function} callback The callback function to run
// */

// const getEventType = $(this).on('touchend click', function(event) {
//     if (event.type == "touchend") {
//         $(this).off('click');
//         const eventType = 'touchend';
//         console.log("Only touch event is fired");
//     } else if (event.type == "click") {
//         $(this).off('touchend');
//         console.log("Only click event is fired");
//     }
//     return event.type;
// });

function onTouch(elSelector, callback) {
    const el = qs(elSelector);
    //const eventType = getEventType(el);
    if (el.addEventListener) {
        //this.allbtn.addEventListener("touchend", () => { this.listAll(); }, false);
        el.addEventListener(eventType, () => { callback; }, false);
        //el.addEventListener(event, callback, false);
    }
    else if (el.attachEvent) {
        el.attachEvent(eventType, () => { callback; })
    }
}

function createLMNT(LMNT, LMNTtype, LMNTid, LMNTtext, LMNTclass) {
    let lmnt = document.createElement(LMNT);
    lmnt.setAttribute('type', LMNTtype);
    lmnt.setAttribute('id', LMNTid);
    lmnt.innerText = LMNTtext;
    lmnt.setAttribute('class', LMNTclass);
    return lmnt;
}

// set footer
function setFooter() {
    if (isElement("autofooter")) {
        writeById("autofooter", createLink("https://rus19023.github.io/myportfolio/", "&copy; 2019-2022 | Doris Rush-Lopez, BYU-Idaho Candidate for Bachelor of Science in Applied Technology"));
    }
}

const createLink = (url, text) => {
    return `<a href="${url}">${text}</a>`;
};

function writeById(output, input) {
    qs(`#${output}`).innerHTML = input;
}

function writeByClass(output, input) {
    qs(`.${output}`).innerHTML = input;
}

function isElement(element) {
    // check if id exists
    const myId = qs(`#${element}`);
    if (typeof myId != "undefined" && myId != null) {
        return myId.nodeType === 1;
    }
}

function isClass(element) {
    // check if class exists
    const myClass = qs(`.${element}`);
    if (typeof myClass != "undefined" && myClass != null) {
        return myClass.nodeType === 1;
    }
}


export { qs, onTouch, createLMNT, setFooter, isClass, isElement, writeByClass, writeById, createLink };