import {config} from '../config'
import {query as exampleQuery} from '../queries/gwsw-example.js';
import {query as physicalObjectsQuery} from '../queries/gwsw-PhysicalObjects.rq.js';

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
    console.log('response fysical objects', response);
    return response;
  } catch (error) {
    return null;
  }
}
