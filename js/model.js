import { API_URL } from "./config.js";
import { AJAX } from "./helpers.js";

export const state = {
  clients: [],
  searchResults: [],
  sortedDescending: false,
  clientModal: {},
};

// Sort the received array
const sortData = function(sortingParam, data) {
  const sortAscending = function(value1, value2) {
    if (value1 < value2) return -1;
    if (value1 > value2) return 1;
    return 0;
  }
  const sortDescending = function(value1, value2) {
    if (value1 < value2) return 1;
    if (value1 > value2) return -1;
    return 0;
  }

  if (sortingParam === 'id') {
    state.clients = state.sortedDescending ? data.sort((a, b) => {
      return sortAscending(a.id, b.id);
    }) : data.sort((a, b) => {
      return sortDescending(a.id, b.id);
    });
  }
  if (sortingParam === 'name') {
    state.clients = state.sortedDescending ? data.sort((a, b) => {
      a = a.surname.concat(a.name, a.lastName).toLowerCase();
      b = b.surname.concat(b.name, b.lastName).toLowerCase();
      return sortAscending(a, b);
    }) : data.sort((a, b) => {
      a = a.surname.concat(a.name, a.lastName).toLowerCase();
      b = b.surname.concat(b.name, b.lastName).toLowerCase();
      return sortDescending(a, b);
    });
  }
  if (sortingParam === 'createdAt') {
    state.clients = state.sortedDescending ? data.sort((a, b) => {
      return sortAscending(a.createdAt, b.createdAt);
    }) : data.sort((a, b) => {
      return sortDescending(a.createdAt, b.createdAt);
    });
  }
  if (sortingParam === 'updatedAt') {
    state.clients = state.sortedDescending ? data.sort((a, b) => {
      return sortAscending(a.updatedAt, b.updatedAt);
    }) : data.sort((a, b) => {
      return sortDescending(a.updatedAt, b.updatedAt);
    });
  }
}

/**
 * Loads the data about clients and finds a particular client or sorts the data if needed
 * @param {string} sortingParam Argument that is used to sort the table (possible values: 'id', 'name', 'createdAt', 'updatedAt')
 * @param {number} id Client ID that is used to find a particular person
 * @returns {}
 */
export const loadData = async function(sortingParam = null, id = null) {
  // If ID argument is passed then load only info about the client with this ID
  if (id) {
    state.clientModal = await AJAX(`${API_URL}/clients/${id}`);
    // findClient(id);
    return;
  }

  // Get data about all the clients from the server
  const data = await AJAX(`${API_URL}/clients`);

  if (sortingParam) sortData(sortingParam, data);
  state.sortedDescending = !state.sortedDescending;
}

// Load the search results containing to the query string
export const loadSearchResults = async function(query) {
  const data = await AJAX(`${API_URL}/clients?search=${query}`);
  state.searchResults = data;
}

/**
 * Gathers data from inputs and transforms it into the object suitable for storing
 * @param {[]} client Client data collected from the form inputs
 * @param {boolean} includeCreatedAt Parameter, which decides if client creation date should be included to the rest of the data
 * @returns {Object} Object with the transformed data from the input fields
 */
const collectClientData = function(client, includeCreatedAt = false) {
  // Creating contacts array
  let contacts = [];
  client.forEach((item, i, arr) => {
    if (item[0] === 'type') contacts.push(Object.fromEntries([item, arr[i + 1]]));
  });

  // Transform the rest of the data from the input fields
  client = Object.fromEntries(client.filter(item => item[0] !== 'type' && item[0] !== 'value'));
  if (includeCreatedAt) client.createdAt = new Date().toISOString();
  client.updatedAt = new Date().toISOString();
  client.contacts = contacts;
  return client;
}

// Upload new client
export const uploadClient = async function(newClient, includeCreatedAt) {
  const clientData = collectClientData(newClient, includeCreatedAt);
  await AJAX(`${API_URL}/clients`, clientData);
}

// Update the data about the existing client
export const updateClient = async function(id, newClientData, includeCreatedAt) {
  const clientData = collectClientData(newClientData, includeCreatedAt);
  await AJAX(`${API_URL}/clients/${id}`, null, clientData);
}

// Delete client
export const deleteClient = async function(id) {
  await AJAX(`${API_URL}/clients/${id}`, null, null, true);
}

// Find client according to his ID
// const findClient = function(id) {
//   state.clientModal = state.clients.find(client => +client.id === +id);
// }