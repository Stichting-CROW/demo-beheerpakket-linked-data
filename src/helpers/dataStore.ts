
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

export const getAttributeValue = (object, attributeName) => {
  let found;
  object.forEach(x => {
    if(x.entry_text === attributeName) {
      found = x.entry_value;
    }
  })
  return found || false;
}
