import View from "./View.js";

class EditClientView extends View {
  _data;
  _selectOptions = ['Телефон', 'Доп. телефон', 'Email', 'Vk', 'Facebook'];

  _parentEl = document.querySelector('.form-edit');
  _tableBody = document.querySelector('.clients__table-body');

  _window = document.querySelector('.modal-edit');
  _overlay = document.querySelector('.overlay');
  _btnClose = this._parentEl.querySelector('.form-edit__close-modal');
  _btnAddContact = this._parentEl.querySelector('.form-edit__btn-add');
  _btnDeleteClient = this._parentEl.querySelector('.form-edit__btn-delete');
  _inputGroupContainer = this._parentEl.querySelector('.form-contacts-edit__input-group-container');

  _clientId = this._parentEl.querySelector('.form__client-id');
  _clientInputSurname = this._parentEl.querySelector('.form-edit__input--surname');
  _clientInputName = this._parentEl.querySelector('.form-edit__input--name');
  _clientInputLastName = this._parentEl.querySelector('.form-edit__input--last-name');

  constructor() {
    super();
    this._addHandlerHideWindow();
    this._addHandlerRenderInputGroup();
    this._addHandlerRemoveInputGroup();
    this._addHandlerDeleteClient();
  }

  // Fills all the input fields of the form
  renderForm(data) {
    this._data = data;
    this._clientId.textContent = `ID: ${this._data.id}`;
    this._clientInputSurname.value = this._data.surname;
    this._clientInputName.value = this._data.name;
    this._clientInputLastName.value = this._data.lastName;
    const markup = this._generateFilledInputMarkup();
    this._inputGroupContainer.innerHTML = '';
    this._inputGroupContainer.insertAdjacentHTML('beforeend', markup);
    this._initPluginChoices();
  }

  _generateInputMarkup() {
    return `
      <div class="form-contacts__input-group">
        <select class="form-contacts__select" name="type">
          <option>Телефон</option>
          <option>Доп. телефон</option>
          <option>Email</option>
          <option>Vk</option>
          <option>Facebook</option>
        </select>
        <input class="form-contacts__input" type="text" placeholder="Введите данные контакта" name="value" required>
        <span class="form-contacts__tooltip">
          <button class="form-contacts__btn-cancel" type="button"></button>
          <span class="form-contacts__popup">Удалить контакт</span>
        </span>
      </div>
    `;
  }

  _generateFilledInputMarkup() {
    return this._data.contacts.map(contact => {
      return `
        <div class="form-contacts__input-group">
          <select class="form-contacts__select" name="type" value="${contact.type}">
            ${this._generateSelectOptionsMarkup(contact)}
          </select>
          <input class="form-contacts__input" type="text" placeholder="Введите данные контакта" name="value" value="${contact.value}" required>
          <span class="form-contacts__tooltip">
            <button class="form-contacts__btn-cancel" type="button"></button>
            <span class="form-contacts__popup">Удалить контакт</span>
          </span>
        </div>
      `;
    }).join('');
  }

  _generateSelectOptionsMarkup(contact) {
    return this._selectOptions.map(option => {
      return contact.type === option ?  `<option selected>${option}</option>` :`<option>${option}</option>`;
    }).join('');
  }

  // Show the modal window with a client info when the app is loaded if there is a query parameter
  addHandlerRenderClient(handler) {
    ['load', 'popstate'].forEach(eventType => window.addEventListener(eventType, (e) => {
      e.preventDefault();
      const id = new URLSearchParams(window.location.search).get('id');
      if (e.type === 'load' && !id) return;
      this.toggleWindow();
      handler(id);
    }));
  }

  // Open modal window
  addHandlerShowWindow(handler) {
    this._tableBody.addEventListener('click', (e) => {
      const clicked = e.target.closest('.clients__body-btn-edit');
      if (!clicked) return;
      this.toggleWindow();
      this._initPluginChoices();
      const clientId = +clicked.dataset.id;
      history.pushState(null, null, `?id=${clientId}`);
      handler(clientId);
    });
  }

  // Hide modal window
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState(null, null, '/');
      this.toggleWindow();
    });
  }

  // Add an input group
  _addHandlerRenderInputGroup() {
    this._btnAddContact.addEventListener('click', (e) => {
      e.preventDefault();
      const countActiveInputs = this._countActiveInputs();
      if (countActiveInputs <= 10) {
        const markup = this._generateInputMarkup();
        this._inputGroupContainer.insertAdjacentHTML('beforeend', markup);
        this._initPluginChoices();
      }
      this._checkShowAddBtn();
    });
  }

  // Remove an input group
  _addHandlerRemoveInputGroup() {
    this._parentEl.addEventListener('click', (e) => {
      const btnRemove = e.target.closest('.form-contacts__btn-cancel');
      if (!btnRemove) return;
      btnRemove.closest('.form-contacts__input-group').remove();
      this._checkShowAddBtn();
    })
  }

  // Delete the data about a client
  _addHandlerDeleteClient() {
    this._btnDeleteClient.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleWindow();
      const confirmDeleteWindow = document.querySelector('.modal-delete');
      this.toggleWindow(confirmDeleteWindow);
      confirmDeleteWindow.querySelector('.delete-client__btn-submit').dataset.id = this._data.id;
    })
  }
}

export default new EditClientView();