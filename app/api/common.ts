import {Attribute, Source} from '../types'

import {getPhysicalObjects as getImborPhysicalObject} from './imbor';
import {getPhysicalObjects as getGwswPhysicalObject} from './gwsw';

import {getAttributesForClass as getImborAttributesForClass} from './imbor';
import {getAttributesForClass as getGwswAttributesForClass} from './gwsw';

import {getEnumsForAttribute as getImborEnumsForAttribute} from './imbor';

import {query as query_imbor_kern__objects} from '../queries/nen2660-PhysicalObjects.rq.js';
import {query as query_gwsw_basis_v161__objects} from '../queries/gwsw-PhysicalObjects.rq.js';

// doRequest :: string -> json
export const doRequest = async (url: string, requestOptions: any) => {
  const response = await fetch(url, requestOptions);
  const responseJson = await response.json();

  return responseJson;
}

export const getPhysicalObjectsForSource = async (source: Source) => {
  let query = '';
  if(source.title === 'IMBOR kern') {
    query = query_imbor_kern__objects();
  } else if(source.title === 'GWSW Basis v1.6.1') {
    query = query_gwsw_basis_v161__objects();
  }
  if(! query) return false;

  let url = source.url;
  const requestOptions: any = source.fetchOptions;
  if(source?.fetchOptions?.method?.toUpperCase() === 'POST') {
    requestOptions.body = `query=${encodeURIComponent(query)}`;
  } else {
    url = `${source.url}?query=${encodeURIComponent(query)}`
  }

  try {
    const response = await doRequest(url, requestOptions);
    return response;
  } catch (error) {
    return false;
  }
}

export const getAttributesForClass = async (activeSource: Source, classUris: any[]) => {
  let attributes_per_source: any = [], head: any;
  for(const classUri of classUris) {
    if(classUri.indexOf('gwsw') > -1) {
      const gwsw_attributes = await getGwswAttributesForClass(classUri);
      head = gwsw_attributes.head;
      attributes_per_source = [...attributes_per_source, ...gwsw_attributes.results?.bindings];
    }
    else {
      const imbor_attributes = await getImborAttributesForClass(classUri);
      head = imbor_attributes.head;
      attributes_per_source = [...attributes_per_source, ...imbor_attributes.results?.bindings];
    }
  }
 
  const merged = {
    head: head,
    results: {
      bindings: deDuplicateAttributes(attributes_per_source)
    }
  }

  // And return
  return merged;
}

export const getEnumsForAttribute = async (attributeUri: string) => {
  // Don't look up enums for GWSW for now
  if(attributeUri.indexOf('gwsw') > -1) return;

  // Get enums for attributeUri
  const imbor_enums = await getImborEnumsForAttribute(attributeUri);

  // And return
  return imbor_enums;
}

// deDuplicateAttributes :: Merge attributes based on entry_text
const deDuplicateAttributes = (attributes: any[]) => {
  if (!attributes) return [];

  // Create variable to store list of unique attributes in
  let deDuplicated: Attribute[] = attributes;

  // Create a Map to store unique entries based on entry_text.value
  const uniqueMap = new Map();
  
  // Iterate through attributes and keep only unique entries
  attributes.forEach((attribute: Attribute) => {
    const entryTextValue = attribute?.entry_text?.value;
    if (entryTextValue && !uniqueMap.has(entryTextValue)) {
      uniqueMap.set(entryTextValue, attribute);
    }
  });

  // Convert Map values back to array
  deDuplicated = Array.from(uniqueMap.values());
  
  (() => {
    // Check if 'identificatie' exists as an attribute field
    const identificatie_exists = deDuplicated.find((attribute: Attribute) => attribute?.entry_text?.value === 'identificatie');
    // If not: Add 'identificatie' object to beginning of the array
    if(! identificatie_exists) deDuplicated.unshift({
      "entry_iri": {
        "type": "uri",
        "value": "https://data.crow.nl/imbor/def/5f430c8d-7503-4a69-9e2f-f0b6e6c7f54e"
      },
      "entry_text": {
        "xml:lang": "nl",
        "type": "literal",
        "value": "identificatie"
      },
      "entry_definition": {
        "xml:lang": "nl",
        "type": "literal",
        "value": "Uniek nummer van het object (GUID), een numerieke identificatie. Conform NEN3610 zijn identificatiecodes persistent: ze wijzigen niet gedurende de levensduur van een object."
      },
      "group_iri": {
        "type": "uri",
        "value": "https://w3id.org/nen2660/def#Object"
      }
    });
  })();

  return deDuplicated;
}

