import { getDataStore } from "./dataStore";

// Import models
import type {
  Object
} from '../models/Object';

export const generateExport = () => {
  let txt = `
    @prefix imbor:              <https://data.crow.nl/imbor/def/> .
    @prefix imbor-domeinwaarde: <https://data.crow.nl/imbor/id/domeinwaarden/> .
    @prefix nen2660:            <https://w3id.org/nen2660/def#> .
    
    @prefix rdf:                <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix geo:                <http://www.opengis.net/ont/geosparql#> .
    @prefix xsd:                <http://www.w3.org/2001/XMLSchema#> .
    @prefix sh:                 <http://www.w3.org/ns/shacl#> .
    @prefix owl:                <http://www.w3.org/2002/07/owl#> .
    @prefix sh:                 <http://www.w3.org/ns/shacl#> .
    
    @prefix data:               <http://example.com/gemeente/areaaldata/id/> .
    
    data: a owl:Ontology ;
            owl:imports <https://w3id.org/nen2660/> ;
            owl:imports <https://data.crow.nl/imbor/def/> ;
            owl:imports <https://data.crow.nl/imbor/id/domeinwaarden/> ;
            .
  `;

  // Get physical objects from data store
  const dataStore = getDataStore();
  Object.keys(dataStore).forEach(uuid => {
    txt += generatePhysicalObject(dataStore[uuid]);
  });

  return txt;
}

const generatePhysicalObject = (data: Object) => {
  let txt = '';

  txt += `
    data:${data.uuid} a imbor:83a942f7-5291-42f0-afb1-9a57d0fb2f15 ; #'${data.label}'
    nen2660:hasBoundary 
    [
        a geo:Geometry ;
  `;

  // If [1] has a value: this is a POINT
  if(data.geometry.inputs[1]) {
    txt += `      a imbor:bdb53bb7-defc-4055-b047-271c5edda82a ; #GM_Point
        geo:asWKT "<http://www.opengis.net/def/crs/EPSG/0/4326>POINT((${data.geometry.inputs[1] ? data.geometry.inputs[1] : ''} ${data.geometry.inputs[0]}))" ;`;
  }
  // Otherwise it's a SURFACE
  else {
    txt += `      a imbor:e995a2d7-b1a2-43c5-a8bc-9ef148c309e6 ; #GM_Surface
        geo:asWKT "<http://www.opengis.net/def/crs/EPSG/0/4326>POLYGON((${data.geometry.inputs[0]}))" ;`;
  }
  
  txt += `
    ]    ; #'geometrie'
`;

  // Generate attributes
  data.attributes?.forEach((attribute: any) => {
    txt += `    ${attribute.uri.value} "${attribute.value}" ; #'${attribute.label}'
`;
  });
  
  txt += `    .
`;
  
  return txt;
}

// Example export: https://github.com/Stichting-CROW/imbor/blob/master/docs/uitwisseling_rdf/files/ld_files/IMBOR_Exchange_Sample.ttl
