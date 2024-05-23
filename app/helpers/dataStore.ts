// Import models
import type {
  Object
} from '../models/Object';

export const getDataStore = () => {
  const dataStore_raw = localStorage.getItem('IMBOR_DEMO_APP_physicalObjects');
  if(! dataStore_raw) return {};
  const dataStore = JSON.parse(dataStore_raw);
  return dataStore;
}

export const getObject = (dataStore, uuid) => {
  if(! dataStore) dataStore = getDataStore();

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

export const getAttributeValue = (object: Object, attributeName: string) => {
  if(! object) throw Error('No object given');
  if(! attributeName) throw Error('No attributeName given');

  let found;
  object.attributes.forEach(x => {
    if(x.label === attributeName) {
      found = x.value;
    }
  })
  return found || false;
}
