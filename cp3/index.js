/*
 * Name: Pui Yan Chan
 * Date: October 26, 2019
 * Section: CSE 154 AA
 *
 * This is the index.js for my Creative Project 3.
 * It implements the UI behaviors of index.html page and calls Movie DB API to retrieve the daily
 * or weekly trending movies and TV shows.
 */

"use strict";
(function() {

  const BASE_URL = "https://api.themoviedb.org/3/trending";
  const API_KEY = "c9e1f612a0ef4833594a38dbc8da9d19";
  const IMG_PATH = "https://image.tmdb.org/t/p/w200";
  const ITEM_NUM = 10;

  window.addEventListener("load", init);

  /**
   * Sets up event-listeners on buttons and generates list of daily trending items by default.
   */
  function init() {
    id("daily-btn").addEventListener("click", generateDailyList);
    id("weekly-btn").addEventListener("click", generateWeeklyList);
    id("daily-btn").addEventListener("click", disableBtn);
    id("weekly-btn").addEventListener("click", disableBtn);
    generateDailyList();
  }

  /**
   * Generates list of daily trending movies and tv-shows.
   */
  function generateDailyList() {
    makeRequest("movie", "day");
    makeRequest("tv", "day");
  }

  /**
   * Generates list of weekly trending movies and tv-shows.
   */
  function generateWeeklyList() {
    makeRequest("movie", "week");
    makeRequest("tv", "week");
  }

  /**
   * Disables the clicked button.
   */
  function disableBtn() {
    qs("button.selected").disabled = false;
    qs("button.selected").classList.remove("selected");
    this.disabled = true;
    this.classList.add("selected");
  }

  /**
   * Gets current trending items from the API.
   * @param {string} mediaType - The media type to be retrieved.
   * @param {object} timeWindow - The trending period of the movies / tv shows.
   */
  function makeRequest(mediaType, timeWindow) {
    id("error-msg").classList.add("hidden");
    let url = BASE_URL + "/" + mediaType + "/" + timeWindow + "?api_key=" + API_KEY;
    fetch(url)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(processData.bind(null, mediaType))
      .catch(handleError);
  }

  /**
   * Appends the given trending items to the page.
   * @param {string} mediaType - The media type retrieved.
   * @param {object} responseData - Json object representing the trending movies / tv shows.
   */
  function processData(mediaType, responseData) {
    let sectionId = "";
    if (mediaType === "movie") {
      sectionId = "movies";
    } else if (mediaType === "tv") {
      sectionId = "tv-shows";
    }
    let posterSection = qs("#" + sectionId + " > .poster");
    posterSection.innerHTML = "";
    for (let i = 0; i < ITEM_NUM; i++) {
      let itemTitle = "";
      if (mediaType === "movie") {
        itemTitle = responseData.results[i].title;
      } else if (mediaType === "tv") {
        itemTitle = responseData.results[i].name;
      }
      let itemDiv = gen("div");
      let posterImg = gen("img");
      let itemP = gen("p");
      itemP.textContent = itemTitle;
      posterImg.src = IMG_PATH + responseData.results[i].backdrop_path;
      posterImg.alt = "poster of " + itemTitle;
      itemDiv.appendChild(posterImg);
      itemDiv.appendChild(itemP);
      posterSection.appendChild(itemDiv);
    }
  }

  /**
   * Displays an error message when error occurs.
   */
  function handleError() {
    id("error-msg").classList.remove("hidden");
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
   * Returns a specific type of element.
   * @param {string} elementType - Type of element to be created.
   * @returns {object} - DOM object with the given type.
   */
  function gen(elementType) {
    return document.createElement(elementType);
  }

})();
