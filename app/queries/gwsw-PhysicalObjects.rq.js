export const query = () => `
  PREFIX nen2660: <https://w3id.org/nen2660/def#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
  PREFIX gwsw: <http://data.gwsw.nl/1.5/totaal/>
  PREFIX sh: <http://www.w3.org/ns/shacl#>
  PREFIX dash: <http://datashapes.org/dash#>

  SELECT
    ?classURI $label ?subClassOf
  WHERE {
    # selecteer klassen die subklasse zijn van FysiekObject
    {?classURI rdfs:subClassOf* gwsw:FysiekObject.}
    UNION
    {?classURI rdfs:subClassOf* nen2660:SpatialRegion.}

    # Selecteer het label
    ?classURI
      rdfs:label ?label .

    #?classURI

    # ... die niet abstract zijn
      #dash:abstract false ;
    # en selecteer het label
      #skos:prefLabel ?label .

  } limit 99999
`
