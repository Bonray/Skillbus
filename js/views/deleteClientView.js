import View from "./View.js";

class DeleteClientView extends View {
  _window = document.querySelector('.modal-delete');
  _tableBody = document.querySelector('.clients__table-body');
  _btnClose = document.querySelector('.delete-client__close-modal');
  _btnCancel = document.querySelector('.delete-client__btn-cancel');
  _btnDelete = document.querySelector('.delete-client__btn-submit');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this._addHandlerHideWindow(this._btnCancel);
  }

  // Delete client
  addHandlerDeleteClient(handler) {
    this._btnDelete.addEventListener('click', (e) => {
      e.preventDefault();
      const id = this._btnDelete.dataset.id;
      handler(id);
      this.toggleWindow();
    })
  }

  // Open modal window
  _addHandlerShowWindow() {
    this._tableBody.addEventListener('click', (e) => {
      e.preventDefault();
      const clicked = e.target.closest('.clients__body-btn-delete');
      if (!clicked) return;
      this.toggleWindow();
      this._window.querySelector('.delete-client__btn-submit').dataset.id = clicked.dataset.id;
    });
  }

  // Close modal window
  _addHandlerHideWindow(btn = this._btnClose) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleWindow();
    });
  }
}

export default new DeleteClientView();