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

// getKern :: string -> json
export const getKern = async (query: string) => {
  const url = config.imbor.kern;
  return await doRequest(`${url}?query=${query}`);
}

export const getFysicalObjects = async (): Promise<any> => {
  const query = `

    PREFIX nen2660: <https://w3id.org/nen2660/def#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX dash: <http://datashapes.org/dash#>

    SELECT
      ?classURI ?label ?subClassOf
    WHERE {
      ?classURI rdf:type rdfs:Class ;
                dash:abstract false ;
                rdfs:subClassOf* ?reeelOfRuimtelijk;
                rdfs:subClassOf ?subClassOf;
                skos:prefLabel ?label .

      FILTER (
        ?reeelOfRuimtelijk IN (
          nen2660:RealObject , nen2660:FunctionalSpace
        )
      )
    }
    ORDER BY STR(?label)
   `

  try{
    const response: {[index: string]: any} = await getKern(encodeURIComponent(query));
    // return response as ResponseData;
    return response;
  } catch (error) {
    return null;
  }

}

export const getAttributesForClass = async (classUri: string): Promise<any> => {
  const query = `
    PREFIX nen2660: <https://w3id.org/nen2660/def#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX dash: <http://datashapes.org/dash#>
    PREFIX sh: <http://www.w3.org/ns/shacl#>

    # Inspiration: https://github.com/Stichting-CROW/ldp-queries/blob/main/src/public/IMBOR2022_Attributen_per_Klasse.rq#L38
    SELECT
      ?entry_iri ?entry_text ?entry_definition ?group_iri
    WHERE {
        <${classUri}> rdf:type rdfs:Class ;
                      dash:abstract false ;
                      rdfs:subClassOf ?group_iri ;
                      rdfs:subClassOf* nen2660:PhysicalObject .

        <${classUri}> sh:property/sh:path ?entry_iri .

        OPTIONAL { ?attributeURI skos:prefLabel ?entry_text . }
        OPTIONAL { ?attributeURI skos:definition ?entry_definition . }
        OPTIONAL { ?attribuut nen2660:hasQuantityKind/skos:prefLabel ?attributQuantityKind . }
    }

   `

  try{
    const response: {[index: string]: any} = await getKern(encodeURIComponent(query));
    return response;
  } catch (error) {
    return null;
  }

}
