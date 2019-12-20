/*
 * Name: Pui Yan Chan
 * Date: November 10, 2019
 * Section: CSE 154 AA
 *
 * This is the index.js for my Creative Project 4.
 * It implements the UI and basic operations (i.e. add and remove) of the note-taking app.
 */

"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * Initializes notes container and sets up event listeners on buttons.
   */
  function init() {
    loadNotes();
    id("add-btn").addEventListener("click", addNote);
    id("add-title").addEventListener("click", openInputBox);
    id("fetch-error").classList.add("hidden");
  }

  /**
   * Loads all notes to the notes container.
   */
  function loadNotes() {
    fetch("/notes/all")
      .then(checkStatus)
      .then(res => res.json())
      .then(generateNotes)
      .catch(handleError);
  }

  /**
   * Generates and appends notes one by one to the page.
   * @param {object} notes - Json object that contains all notes.
   */
  function generateNotes(notes) {
    for (let i = 0; i < notes.length; i++) {
      let noteItem = gen("li");
      noteItem.id = notes[i].id;
      let noteTitle = gen("p");
      noteTitle.textContent = notes[i].title;
      let noteBtns = gen("div");
      noteBtns.classList.add("note-btns");
      let removeBtn = gen("button");
      removeBtn.classList.add("remove-btn");
      removeBtn.addEventListener("click", removeNote);
      let removeBtnImg = gen("img");
      removeBtnImg.src = "img/trash-black.png";
      removeBtnImg.alt = "remove to-do item button";
      removeBtn.appendChild(removeBtnImg);
      noteBtns.appendChild(removeBtn);
      noteItem.appendChild(noteTitle);
      noteItem.appendChild(noteBtns);
      noteItem.addEventListener("click", openModal);
      id("notes-list").appendChild(noteItem);
      id("add-title").value = "";
      id("add-content").value = "";
    }
    if (notes.length > 0) {
      id("no-notes").classList.add("hidden");
    } else if (notes.length === 0) {
      id("no-notes").classList.remove("hidden");
    }
    id("fetch-error").classList.add("hidden");
  }

  /**
   * Opens the input box for users to add a note.
   */
  function openInputBox() {
    qs("header").id = "long-header";
    id("add-content").classList.remove("hidden");
    document.addEventListener("click", closeInputBox);
  }

  /**
   * Closes the input box when user clicks outside the box or finishes adding the note.
   * @param {object} event - Click event.
   */
  function closeInputBox(event) {
    let target = event.target;
    let form = qs("form");
    let addQuick = id("add-quick");
    if (target !== form && target.parentNode !== form && target.parentNode !== addQuick) {
      qs("header").id = "short-header";
      id("add-content").classList.add("hidden");
      document.removeEventListener("click", closeInputBox);
    }
  }

  /**
   * Adds the note by sending a post request.
   * @param {object} event - Click event.
   */
  function addNote(event) {
    event.preventDefault();
    let formData = new FormData();
    if (qsa("#notes-list > li").length > 0) {
      formData.append("id", parseInt(id("notes-list").lastChild.id) + 1);
    } else {
      formData.append("id", 1);
    }
    formData.append("title", id("add-title").value);
    formData.append("content", id("add-content").value);
    if (id("add-title").value) {
      fetch("/add-note", {method: "POST", body: formData})
        .then(checkStatus)
        .then(() => window.location.reload(true))
        .catch(handleError);
    }
  }

  /**
   * Removes a note when the trash button is clicked.
   * @param {object} event - Click event.
   */
  function removeNote(event) {
    event.preventDefault();
    let note = this.parentNode.parentNode;
    let formData = new FormData();
    formData.append("id", parseInt(note.id));
    fetch("/remove-note", {method: "POST", body: formData})
      .then(checkStatus)
      .then(() => window.location.reload(true))
      .catch(handleError);
  }

  /**
   * Opens the modal when user clicks the note.
   * @param {object} event - Click event.
   */
  function openModal(event) {
    id("modal").classList.remove("hidden");
    document.addEventListener("click", closeModal);
    let target = event.target;
    if (target.tagName === "P") {
      target = target.parentNode;
    }
    if (target.tagName !== "IMG") {
      fetch("/notes/" + target.id)
        .then(checkStatus)
        .then(res => res.json())
        .then(renderModal)
        .catch(handleError);
    }
  }

  /**
   * Renders the modal.
   * @param {object} note - Object that contains information about the note.
   */
  function renderModal(note) {
    qs("#modal-body > h2").textContent = note.title;
    qs("#modal-body > p").textContent = note.content;
    id("fetch-error").classList.add("hidden");
  }

  /**
   * Closes the modal when user clicks outside the modal.
   * @param {object} event - Click event.
   */
  function closeModal(event) {
    let target = event.target;
    let modalBody = id("modal-body");
    let notesList = id("notes-list");
    if (target !== modalBody && target.parentNode !== modalBody &&
        target.parentNode !== notesList && target.parentNode.parentNode !== notesList) {
      id("modal").classList.add("hidden");
      document.removeEventListener("click", closeModal);
    }
  }

  /**
   * Displays an error message when error occurs.
   */
  function handleError() {
    id("fetch-error").classList.remove("hidden");
  }

  /* --- CSE 154 HELPER FUNCTIONS --- */

  /**
   * Returns the response's result if successful, otherwise returns the rejected Promise result
   * with an error status and corresponding text.
   * @param {object} response - Response to check for success / error.
   * @return {object} response - Valid response if response was successful, otherwise rejected
   *                             Promise result.
   */
  function checkStatus(response) {
    if (!response.ok) {
      throw Error("Error in request: " + response.statusText);
    }
    return response;
  }

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
