import {config} from '../config'
import {query as exampleQuery} from '../queries/gwsw-example.js';
import {query as physicalObjectsQuery} from '../queries/gwsw-PhysicalObjects.rq.js';
import {query as attributesQuery} from '../queries/nen2660-attributes.rq.js';

// doRequest :: string -> json
const doRequest = async (url: string, query: string) => {
  let fetchOptions = {
    method: "POST",
    headers: {
      'Accept': 'application/x-sparqlstar-results+json, application/sparql-results+json;q=0.9, */*;q=0.8',
      "Content-Type": 'application/x-www-form-urlencoded'
    },
    body: query
  }
  const response = await fetch(url, fetchOptions);
  const responseJson = await response.json();

  return responseJson;
}

// getKern :: string -> json
export const getGwsw = async (query: string) => {
  const url = config.imbor.gwsw_basis_v15;
  return await doRequest(`${url}`, `query=${query}`);
}

export const getExample = async (): Promise<any> => {
  const query = exampleQuery();

  try{
    const response: {[index: string]: any} = await getGwsw(encodeURIComponent(query));
    return response;
  } catch (error) {
    return null;
  }
}

export const getPhysicalObjects = async (): Promise<any> => {
  const query = physicalObjectsQuery();

  try{
    const response: {[index: string]: any} = await getGwsw(encodeURIComponent(query));
    return response;
  } catch (error) {
    return null;
  }
}

// Inspiration: https://github.com/Stichting-CROW/ldp-queries/blob/main/src/public/IMBOR2022_Attributen_per_Klasse.rq#L38
export const getAttributesForClass = async (classUri: string): Promise<any> => {
  console.log('classUri', classUri)
  const query = attributesQuery(classUri)

  try {
    const response: {[index: string]: any} = await getGwsw(encodeURIComponent(query));
    return response;
  } catch (error) {
    return null;
  }

}
