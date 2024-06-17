import {config} from '../config'
import {query as attributesQuery} from '../queries/nen2660-attributes.rq.js';
import {query as attributeEnumsQuery} from '../queries/nen2660-attribute-enum-values.rq.js';
import {query as physicalObjectsQuery} from '../queries/nen2660-PhysicalObjects.rq.js';
import {query as geoClassesQuery} from '../queries/geoklasse.rq.js';

// doRequest :: string -> json
const doRequest = async (url: string) => {
  let fetchOptions = {
    headers: {
      "Content-Type": 'application/sparql-query',
      "authorization": `Basic ${process.env.NEXT_PUBLIC_IMBOR_TOKEN}`
    }
  }
  const response = await fetch(url, fetchOptions);
  const responseJson = await response.json();

  return responseJson;
}

// doPostRequest :: string -> json
const doPostRequest = async (url: string, body: any) => {
  let fetchOptions = {
    method: "post",
    headers: {
      "Content-Type": 'application/sparql-query',
      "authorization": `Basic ${process.env.NEXT_PUBLIC_IMBOR_TOKEN}`
    },
    body: body
  }
  const response = await fetch(url, fetchOptions);
  const responseJson = await response.json();

  return responseJson;
}

// getHubLacesTechImborGecombineerd :: string -> json
export const getImborGecombineerd = async (query: string) => {
  const url = 'https://api.datasets.crow.nl/datasets/imbor/latest/services/virtuoso/sparql';
  return await doPostRequest(url, query);
}

// getKern :: string -> json
export const getKern = async (query: string) => {
  const url = config.imbor.kern;
  return await doRequest(`${url}?query=${query}`);
}

// getKernInformatief :: string -> json
export const getKernInformatief = async (query: string) => {
  const url = config.imbor['kern_informatief'];
  return await doRequest(`${url}&query=${query}`);
}

export const getPhysicalObjects = async (): Promise<any> => {
  const query = physicalObjectsQuery();

  try {
    const response: {[index: string]: any} = await getKern(encodeURIComponent(query));
    return response;
  } catch (error) {
    return null;
  }
}

export const getGeoClasses = async (): Promise<any> => {
  const query = geoClassesQuery();

  try {
    const response: {[index: string]: any} = await getKernInformatief(encodeURIComponent(query));
    return response;
  } catch (error) {
    return null;
  }
}

// Inspiration: https://github.com/Stichting-CROW/ldp-queries/blob/main/src/public/IMBOR2022_Attributen_per_Klasse.rq#L38
export const getAttributesForClass = async (classUri: string): Promise<any> => {
  const query = attributesQuery(classUri)

  try {
    const response: {[index: string]: any} = await getKern(encodeURIComponent(query));
    return response;
  } catch (error) {
    return null;
  }
}

export const getEnumsForAttribute = async (classUri: string): Promise<any> => {
  const query = attributeEnumsQuery(classUri)

  try {
    const response: {[index: string]: any} = await getImborGecombineerd(query);
    return response;
  } catch (error) {
    return null;
  }
}
