import {Source} from '../types'

import {getPhysicalObjects as getImborPhysicalObject} from './imbor';
import {getPhysicalObjects as getGwswPhysicalObject} from './gwsw';

import {getAttributesForClass as getImborAttributesForClass} from './imbor';
import {getAttributesForClass as getGwswAttributesForClass} from './gwsw';

import {getEnumsForAttribute as getImborEnumsForAttribute} from './imbor';

import {query as query_imbor_kern__objects} from '../queries/nen2660-PhysicalObjects.rq.js';
import {query as query_gwsw_basis_v15__objects} from '../queries/gwsw-PhysicalObjects.rq.js';

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
  } else if(source.title === 'GWSW Basis v161') {
    query = query_gwsw_basis_v15__objects();
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
    // const response: {[index: string]: any} = await getKern(encodeURIComponent(query));
    return response;
  } catch (error) {
    return false;
  }

  // const imbor_objects = await getImborPhysicalObject();
  // const gwsw_objects = await getGwswPhysicalObject();

  // // Merge both objects
  // const merged = {
  //   head: imbor_objects.head,
  //   results: {
  //     bindings: [
  //       ...imbor_objects.results.bindings,
  //       ...gwsw_objects.results.bindings
  //     ]
  //   }
  // }

  // // And return
  // return merged;
}

export const getPhysicalObjects = async () => {
  const imbor_objects = await getImborPhysicalObject();
  const gwsw_objects = await getGwswPhysicalObject();

  // Merge both objects
  const merged = {
    head: imbor_objects.head,
    results: {
      bindings: [
        ...imbor_objects.results.bindings,
        ...gwsw_objects.results.bindings
      ]
    }
  }

  // And return
  return merged;
}

export const getAttributesForClass = async (classUri: string) => {
  const imbor_attributes = await getImborAttributesForClass(classUri);
  // const gwsw_attributes = await getGwswAttributesForClass(classUri);

  // Merge both objects
  const merged = {
    head: imbor_attributes.head,
    results: {
      bindings: [
        ...imbor_attributes.results.bindings
      ]
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
