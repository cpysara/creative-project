/*
 * Name: Pui Yan Chan
 * Date: October 15, 2019
 * Section: CSE 154 AA
 *
 * This is the index.js for my Creative Project 2.
 * It implements the UI and basic operations (i.e. add and remove) of the to-do list.
 */

"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * Sets up event-listeners on buttons.
   */
  function init() {
    let addBtn = id("add-btn");
    addBtn.addEventListener("click", addItem);

    let addInput = id("add-input");
    addInput.addEventListener("keyup", addItemByEnter);

    let checkBtns = qsa(".check-btn");
    for (let i = 0; i < checkBtns.length; i++) {
      checkBtns[i].addEventListener("click", checkItem);
    }

    let uncheckBtns = qsa(".uncheck-btn");
    for (let i = 0; i < uncheckBtns.length; i++) {
      uncheckBtns[i].addEventListener("click", uncheckItem);
    }

    let removeBtns = qsa(".remove-btn");
    for (let i = 0; i < removeBtns.length; i++) {
      removeBtns[i].addEventListener("click", removeItem);
    }
  }

  /**
   * Adds a to-do task when the add button is clicked.
   */
  function addItem() {
    let toDoList = id("to-do-list");
    let taskItem = gen("li");
    let taskDescription = gen("p");
    taskDescription.textContent = id("add-input").value;
    let taskBtns = gen("div");
    taskBtns.classList.add("task-btns");
    let removeBtn = gen("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", removeItem);
    let removeBtnImg = gen("img");
    removeBtnImg.src = "img/trash-black.png";
    removeBtnImg.alt = "remove to-do item button";
    let checkBtn = gen("button");
    checkBtn.classList.add("check-btn");
    checkBtn.addEventListener("click", checkItem);
    let checkBtnImg = gen("img");
    checkBtnImg.src = "img/uncheck.png";
    checkBtnImg.alt = "check to-do item button";
    removeBtn.appendChild(removeBtnImg);
    checkBtn.appendChild(checkBtnImg);
    taskBtns.appendChild(removeBtn);
    taskBtns.appendChild(checkBtn);
    taskItem.appendChild(taskDescription);
    taskItem.appendChild(taskBtns);
    toDoList.appendChild(taskItem);
    id("add-input").value = "";
    countItems("to-do-list");
  }

  /**
   * Adds a to-do task when the enter key is pressed.
   * @param {object} event - Keyboard event.
   */
  function addItemByEnter(event) {
    const ENTER_KEY = 13;
    if (event.keyCode === ENTER_KEY) {
      addItem();
    }
  }

  /**
   * Marks a to-do task as a completed task when the check button is clicked.
   */
  function checkItem() {
    let completedList = id("completed-list");
    let taskItem = this.parentNode.parentNode;
    this.classList.replace("check-btn", "uncheck-btn");
    this.getElementsByTagName("img")[0].src = "img/checked.png";
    this.removeEventListener("click", checkItem);
    this.addEventListener("click", uncheckItem);
    completedList.appendChild(taskItem);
    countItems("to-do-list");
    countItems("completed-list");
  }

  /**
   * Marks a completed task as a to-do task when the uncheck button is clicked.
   */
  function uncheckItem() {
    let toDoList = id("to-do-list");
    let taskItem = this.parentNode.parentNode;
    this.classList.replace("uncheck-btn", "check-btn");
    this.getElementsByTagName("img")[0].src = "img/uncheck.png";
    this.removeEventListener("click", uncheckItem);
    this.addEventListener("click", checkItem);
    toDoList.appendChild(taskItem);
    countItems("to-do-list");
    countItems("completed-list");
  }

  /**
   * Removes a task when the trash button is clicked.
   */
  function removeItem() {
    let taskItem = this.parentNode.parentNode;
    let taskListId = taskItem.parentNode.id;
    taskItem.remove();
    if (taskListId === "to-do-list") {
      countItems("to-do-list");
    } else if (taskListId === "completed-list") {
      countItems("completed-list");
    }
  }

  /**
   * Counts number of tasks within a given list and updates list description accordingly.
   * @param {string} list - List ID.
   */
  function countItems(list) {
    let listContainer = id(list + "-container");
    let listItems = qsa("#" + list + " > li");
    let listDescription = qs("#" + list + "-container > p");
    if (listItems.length > 0 && listDescription !== null) {
      listDescription.remove();
    } else if (listItems.length === 0 && listDescription === null) {
      listDescription = gen("p");
      if (list === "to-do-list") {
        listDescription.textContent = "You don't have any to-do items";
      } else if (list === "completed-list") {
        listDescription.textContent = "You have not yet completed any tasks";
      }
      listContainer.insertBefore(listDescription, qs("#" + list + "-container > ul"));
    }
  }

  /* --- CSE 154 HELPER FUNCTIONS --- */

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - Element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} query - CSS query selector.
   * @returns {object} - The first DOM object matching the query.
   */
  function qs(query) {
    return document.querySelector(query);
  }

  /**
   * Returns an array of elements matching the given query.
   * @param {string} query - CSS query selector.
   * @returns {array} - Array of DOM objects matching the given query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * Returns a specific type of element.
   * @param {string} elementType - Type of element to be created.
   * @returns {object} - DOM object with the given type.
   */
  function gen(elementType) {
    return document.createElement(elementType);
  }

})();
