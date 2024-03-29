import {config} from '../config'
import {query as attributesQuery} from '../queries/nen2660-attributes.rq.js';
import {query as physicalObjectsQuery} from '../queries/nen2660-PhysicalObjects.rq.js';
import {query as geoClassesQuery} from '../queries/geoklasse.rq.js';

// doRequest :: string -> json
const doRequest = async (url: string) => {
  let fetchOptions = {
    headers: {
      "Content-Type": 'application/sparql-query',
      "authorization": `Basic ${process.env.REACT_APP_IMBOR_TOKEN}`
    }
  }
  const response = await fetch(url, fetchOptions);
  const responseJson = await response.json();

  return responseJson;
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

export const getFysicalObjects = async (): Promise<any> => {
  const query = physicalObjectsQuery();

  try{
    const response: {[index: string]: any} = await getKern(encodeURIComponent(query));
    return response;
  } catch (error) {
    return null;
  }
}

export const getGeoClasses = async (): Promise<any> => {
  const query = geoClassesQuery();

  try{
    const response: {[index: string]: any} = await getKernInformatief(encodeURIComponent(query));
    return response;
  } catch (error) {
    return null;
  }
}

// Inspiration: https://github.com/Stichting-CROW/ldp-queries/blob/main/src/public/IMBOR2022_Attributen_per_Klasse.rq#L38
export const getAttributesForClass = async (classUri: string): Promise<any> => {
  const query = attributesQuery(classUri)

  try{
    const response: {[index: string]: any} = await getKern(encodeURIComponent(query));
    return response;
  } catch (error) {
    return null;
  }

}

