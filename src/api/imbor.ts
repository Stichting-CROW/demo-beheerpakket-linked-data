import {config} from '../config'
import {query as attributesQuery} from '../queries/nen2660-attributes.rq.js';
import {query as fysicalObjectsQuery} from '../queries/nen2660-attributes.rq.js';

// doRequest :: string -> json
const doRequest = async (url: string) => {
  let fetchOptions = {
    headers: {
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

export const getFysicalObjects = async (): Promise<any> => {
  const query = fysicalObjectsQuery();

  try{
    const response: {[index: string]: any} = await getKern(encodeURIComponent(query));
    // return response as ResponseData;
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
