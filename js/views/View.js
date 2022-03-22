export default class View {
  _overlay = document.querySelector('.overlay');
  _inputsName = document.querySelectorAll('.form__input');
  
  renderModalSpinner() {
    const markup = `
      <div class="modal__preloader">
        <svg class="spinner" width="80" height="80" viewbox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.00025 40.0005C4.00025 59.8825 20.1182 76.0005 40.0002 76.0005C59.8822 76.0005 76.0002 59.8825 76.0002 40.0005C76.0002 20.1185 59.8823 4.00049 40.0003 4.00049C35.3513 4.00048 30.9082 4.88148 26.8282 6.48648" stroke="#9873FF" stroke-width="8" stroke-miterlimit="10" stroke-linecap="round"/>
        </svg>
      </div>
    `;
    this._parentEl.insertAdjacentHTML('beforeend', markup);
  }

  removeModalSpinner() {
    this._parentEl.querySelector('.modal__preloader').remove();
  }

  _clear(el = this._parentEl) {
    el.innerHTML = '';
  }

  // Hide/show modal window
  toggleWindow(window = this._window) {
    this._overlay.classList.toggle('hidden');
    window.classList.toggle('hidden');
  }

  // Initialize the plugin every time new select is created
  _initPluginChoices() {
    const elements = document.querySelectorAll('select');
    elements.forEach(element => {
      if (!element.classList.contains('choices__input')) {
        const choices = new Choices(element, {
          searchEnabled: false,
          itemSelectText: '',
        });
      }
    });
  }

  // Count the number of inputs in the form
  _countActiveInputs() {
    return this._parentEl.querySelectorAll('.form-contacts__input-group').length;
  }

  // Hide/show "Add new client" button
  _checkShowAddBtn() {
    const countActiveInputs = this._countActiveInputs();
    if (countActiveInputs >= 10) this._btnAddContact.classList.add('hidden');
    else this._btnAddContact.classList.remove('hidden');
  }
  
  // Submit form
  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const dataArr = [...new FormData(this._parentEl)];
      handler(dataArr);
      this._inputGroupContainer.innerHTML = '';
      this._inputsName.forEach(input => input.value = '');
      history.pushState(null, null, '/');
      this.toggleWindow();
    });
  }
}