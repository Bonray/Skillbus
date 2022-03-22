import View from "./View.js";

class AddClientView extends View {
  _parentEl = document.querySelector('.form-add');

  _window = document.querySelector('.modal-add');
  _btnOpen = document.querySelector('.add-client__btn');
  _btnClose = document.querySelector('.form-add__close-modal');
  _btnAddContact = document.querySelector('.form-add__btn-add');
  _btnCancel = document.querySelector('.form__btn-cancel');
  _inputGroupContainer = document.querySelector('.form-contacts-new__input-group-container');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this._addHandlerHideWindow(this._btnCancel);
    this._addHandlerRenderInputGroup();
    this._addHandlerRemoveInputGroup();
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
          <button class="form-contacts__btn-cancel"></button>
          <span class="form-contacts__popup">Удалить контакт</span>
        </span>
      </div>
    `;
  }

  // Open modal window
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', () => {
      this.toggleWindow();
      this._initPluginChoices();
    });
  }

  // Hide modal window
  _addHandlerHideWindow(btn = this._btnClose) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleWindow();
    });
  }

  // Add an input group (select + input field)
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
}

export default new AddClientView();