
export const getDataStore = () => {
  const dataStore_raw = localStorage.getItem('IMBOR_DEMO_APP_physicalObjects');
  if(! dataStore_raw) return;
  const dataStore = JSON.parse(dataStore_raw);
  return dataStore;
}

export const getObject = (dataStore, uuid) => {
  let result;
  Object.keys(dataStore).forEach(key => {
    if(key === uuid) {
      result = dataStore[key];
    }
  })
  if(result) {
    return result;
  }
  return false;
}

export const deleteObject = (uuid) => {
  if(! uuid) return;

  // Get dataStore
  const dataStore = getDataStore();

  // Create new dataStore without the given uuid
  let newDataStore = {};
  Object.keys(dataStore).forEach(key => {
    if(key !== uuid) {
      newDataStore[key] = dataStore[key];
    }
  })

  // Replace existing dataStore with the new dataStore
  localStorage.setItem('IMBOR_DEMO_APP_physicalObjects', JSON.stringify(newDataStore));

  // Return newDataStore
  return newDataStore;
}

export const getAttributeValue = (object, attributeName) => {
  let found;
  object.forEach(x => {
    if(x.entry_text === attributeName) {
      found = x.entry_value;
    }
  })
  return found || false;
}
