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

export const getAttributesForClass = async (source: Source, classUri: string) => {
  const imbor_attributes = await getImborAttributesForClass(classUri);
  const gwsw_attributes = await getGwswAttributesForClass(classUri);
 
  // Merge both objects
  let merged_bindings = mergeAttributes(
    gwsw_attributes.results?.bindings,
    imbor_attributes.results?.bindings
  );
  const merged = {
    head: imbor_attributes.head,
    results: {
      bindings: merged_bindings
    }
  }

  // And return
  return merged;
}

export const getEnumsForAttribute = async (attributeUri: string) => {
  const imbor_enums = await getImborEnumsForAttribute(attributeUri);

  // Merge both objects
  const merged = imbor_enums;

  // And return
  return merged;
}

// mergeAttributes :: Merge attributes based on entry_text
const mergeAttributes = (bindings1: Attribute[], bindings2: Attribute[]) => {
  if (!bindings1 && !bindings2) return [];
  if (!bindings1) return bindings2;
  if (!bindings2) return bindings1;

  let merged: Attribute[] = bindings1;

  // Add bindings2 entries, if not present in bindings1 dataset
  bindings2.forEach((x2: Attribute) => {
    const related_attribute: Attribute | undefined = bindings1.find((x1: Attribute) => x1.entry_text?.value === x2.entry_text?.value);
    if(! related_attribute) merged.push(x2);
  });

  (() => {
    // Check if 'identificatie' exists as an attribute field
    const identificatie_exists = merged.find((attribute: Attribute) => attribute?.entry_text?.value === 'identificatie');
    // If not: Add 'identificatie' object to beginning of the array
    if(! identificatie_exists) merged.unshift({
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

  return merged;
}

