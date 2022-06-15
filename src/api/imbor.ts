import {config} from '../config'

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

// getVocabulaire :: string -> json
export const getVocabulaire = async (query: string) => {
  const url = config.imbor.vocabulaire;
  return await doRequest(`${url}?query=${query}`);
}
