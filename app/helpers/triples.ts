import { DataFactory } from 'rdf-data-factory';
const factory = new DataFactory();

const makeTriple = (obj) => {
  let data = {};
  for(let key in obj) {
    data[key] = obj[key];
  }

  return data;
}

const makeTriplesObject = (response) => {
  let triples: any = [];

  // Return unique triples
  return response.results.bindings;
}

const getUniquePhysicalObjects = (input) => {
  // Only keep unique ones
  let uniqueUris = [];
  let uniqueTriples = [];
  Object.keys(input).forEach((key) => {
    const triple = input[key];
    if(uniqueUris.indexOf(triple.classURI.value) > -1) {
      return false;
    }
    uniqueUris.push(triple.classURI.value)
    uniqueTriples.push(triple);
  });

  return uniqueTriples;
}

export {
  makeTriple,
  makeTriplesObject,
  getUniquePhysicalObjects,
}
