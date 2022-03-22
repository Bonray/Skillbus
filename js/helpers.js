/**
 * Functions that sends the fetches a resource from the server
 * @param {string} url the resource you want to fetch
 * @param {Object} uploadData the parameter that, if passed, sends the data about new client to the server
 * @param {Object} updateData the parameter that, if passed, updates the data about the existing
 * @param {boolean} deleteClient the parameter that, if passed, deletes a client
 * @returns {Object | Object[]}
 */
export const AJAX = async function(url, uploadData = null, updateData = null, deleteClient = false) {
  const fetchPro = uploadData ? fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(uploadData),
  }) : updateData ? fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  }): deleteClient ? fetch(url, {
    method: 'DELETE'
  }): fetch(url);

  const response = await fetchPro;
  const data = await response.json();
  return data;
}