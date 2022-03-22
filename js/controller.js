import * as model from './model.js';
import tableView from './views/tableView.js';
import searchView from './views/searchView.js';
import addClientView from './views/addClientView.js';
import editClientView from './views/editClientView.js';
import deleteClientView from './views/deleteClientView.js';

const controlClients = async function() {
  // Preloader
  tableView.renderTableSpinner();

  // Load data
  await model.loadData('id');

  // Render data
  tableView.render(model.state.clients);
}

const controlSortClients = async function(sortingParam) {
  // Preloader
  tableView.renderTableSpinner();

  // Load data
  await model.loadData(sortingParam);
  
  // Render results
  tableView.render(model.state.clients);
}

const controlSearchResults = async function() {
  // Get search query
  const query = searchView.getQuery();

  // Load search results
  await model.loadSearchResults(query);

  // Render search options results
  searchView.renderSearchOptions(model.state.searchResults);
}

const controlSearchSubmit = function() {
  // Highlight the search results
  searchView.highlightClient(model.state.searchResults);
}

const controlAddClient = async function(newClient) {
  // Upload the new client data
  await model.uploadClient(newClient, true);

  // Load updated clients data
  await model.loadData('id');

  // Render data
  tableView.render(model.state.clients);
}

const controlEditClient = async function(id) {
  // Preloader
  editClientView.renderModalSpinner();
  
  // Load data
  await model.loadData(null, id);

  // Remove spinner and render filled form
  editClientView.removeModalSpinner();
  editClientView.renderForm(model.state.clientModal);
}

const controlUpdateClient = async function(client) {
  // Update the client data in the state
  await model.updateClient(model.state.clientModal.id, client);

  // Load updated clients data
  await model.loadData('id');

  // Render data
  tableView.render(model.state.clients);
}

const controlDeleteClient = async function(id) {
  // Delete client
  await model.deleteClient(id);

  // Load updated clients data
  await model.loadData('id');
  
  // Render data
  tableView.render(model.state.clients);  
}

const init = function() {
  tableView.addHandlerRender(controlClients);
  tableView.addHandlerSortTable(controlSortClients);
  searchView.addHandlerSearch(controlSearchResults);
  searchView.addHandlerSubmit(controlSearchSubmit);
  addClientView.addHandlerUpload(controlAddClient);
  editClientView.addHandlerRenderClient(controlEditClient);
  editClientView.addHandlerShowWindow(controlEditClient);
  editClientView.addHandlerUpload(controlUpdateClient);
  deleteClientView.addHandlerDeleteClient(controlDeleteClient);
}
init();
