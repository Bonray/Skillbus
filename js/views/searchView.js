import View from './View.js';
import {TIMEOUT_SEC} from '../config.js';

class SearchView extends View {
  constructor() {
    super();
    this._addHandlerChooseSearchResult();
    this._addHandlerKeyboardMove();
    this._addHandlerCloseSearchOptions();
  }

  _parentEl = document.querySelector('.header__form');
  _input = document.querySelector('.header__input');
  _searchResultsContainer = document.querySelector('.header__search-results-container');
  _errorMessage = 'Не найдено совпадений по вашему запросу.';
  _timeout;
  _data;
  _focusedElIndex;

  getQuery() {
    const query = this._parentEl.querySelector('.header__input').value.trim();
    return query;
  }

  // Render the possible search options
  renderSearchOptions(data) {
    if (!data || (Array.isArray(data) && !data.length)) return this.renderError();
    if (!this._input.value.trim()) return;
    this._data = data;
    this._focusedElIndex = -1;
    const searchOptionsMarkup = this._generateSearchOptionsMarkup(this._input.value);
    this._clear(this._searchResultsContainer);
    this._searchResultsContainer.insertAdjacentHTML('beforeend', searchOptionsMarkup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <p class="error-message">${message}</p>
    `;
    this._clear(this._searchResultsContainer);
    this._searchResultsContainer.insertAdjacentHTML('beforeend', markup);
  }

  // Highlight the contact that matches the query string
  highlightClient(data) {
    const clients = document.querySelectorAll('.clients__body-row');
    clients.forEach(client => client.classList.remove('active'));
    if (!this._input.value.trim()) return;
    this._data = data;
    clients.forEach(client => client.classList.remove('active'));
    clients.forEach(client => {
      if (this._data.some(el => el.id === client.dataset.id)) client.classList.add('active');
    });
  }

  // Generate search options markup
  _generateSearchOptionsMarkup(inputValue) {
    const markupArr =  this._data.map(contact => {
      return `
        <div class="header__form-search-result">${contact.surname.toLowerCase().includes(inputValue.toLowerCase()) ? contact.surname : contact.name.toLowerCase().includes(inputValue.toLowerCase()) ? contact.name : contact.lastName}</div>
      `;
    });
    const markup = [...new Set(markupArr)].join('');
    return markup;
  }

  // Add active class to the hovered search option
  _addActiveClass(searchOptions) {
    searchOptions.forEach(el => el.classList.remove('active'));
    if (this._focusedElIndex >= searchOptions.length) this._focusedElIndex = 0;
    if (this._focusedElIndex < 0) this._focusedElIndex = (searchOptions.length - 1);
    searchOptions[this._focusedElIndex].classList.add('active');
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('input', (e) => {
      e.preventDefault();
      clearTimeout(this._timeout);
      this._timeout = setTimeout(handler, TIMEOUT_SEC * 1000);
    });
  }

  addHandlerSubmit(handler) {
    this._parentEl.addEventListener('submit', (e) => {
      e.preventDefault();
      this._clear(this._searchResultsContainer);
      handler();
    });
  }

  _addHandlerChooseSearchResult() {
    this._searchResultsContainer.addEventListener('click', (e) => {
      const clicked = e.target.closest('.header__form-search-result');
      if (!clicked) return;
      this._input.value = clicked.textContent;
      this._clear(this._searchResultsContainer);
    })
  }

  _addHandlerKeyboardMove() {
    this._input.addEventListener('keydown', (e) => {
      const searchOptions = document.querySelectorAll('.header__form-search-result');
      if (!searchOptions.length) return;
      if (e.keyCode === 40) {
        this._focusedElIndex++;
        this._addActiveClass(searchOptions);
      }
      if (e.keyCode === 38) {
        this._focusedElIndex--;
        this._addActiveClass(searchOptions);
      }
      if (e.keyCode === 13) {
        if (this._focusedElIndex > -1) {
          searchOptions[this._focusedElIndex].click();
        }
      }
    });
  }

  _addHandlerCloseSearchOptions() {
    window.addEventListener('click', () => {
      this._clear(this._searchResultsContainer);
    });
  }
}

export default new SearchView();