import { DataFactory } from 'rdf-data-factory';
const factory = new DataFactory();

const makeTriple = (obj: any) => {
  let data: any = {};
  for(let key in obj) {
    data[key] = obj[key];
  }

  return data;
}

const makeTriplesObject = (response: any) => {
  let triples: any = [];

  // Return unique triples
  return response.results.bindings;
}

const getUniquePhysicalObjects = (input: { [x: string]: any; }) => {
  // Only keep unique ones, remove duplicates
  let uniqueLabels: any[] = [];
  let uniqueTriples: any[] = [];

  if(! input) return uniqueTriples;
  Object.keys(input).forEach((key) => {
    const triple = input[key];
    if(uniqueLabels.indexOf(triple.label.value) > -1) {
      return false;
    }
    uniqueLabels.push(triple.label.value)
    uniqueTriples.push(triple);
  });

  return uniqueTriples;
}

export {
  makeTriple,
  makeTriplesObject,
  getUniquePhysicalObjects,
}
