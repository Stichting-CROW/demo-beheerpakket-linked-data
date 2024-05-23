export const query = () => `

  PREFIX nen2660: <https://w3id.org/nen2660/def#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
  PREFIX dash: <http://datashapes.org/dash#>

  SELECT
    ?classURI ?label ?subClassOf
  WHERE {
    # selecteer klassen die subklasse zijn van RealObject OF SpatialRegion
  	{?classURI rdfs:subClassOf* nen2660:RealObject.}
  	UNION
  	{?classURI rdfs:subClassOf* nen2660:SpatialRegion.}
  	
    ?classURI 
    # ... die niet abstract zijn
        dash:abstract false ;
    # en selecteer het label
        skos:prefLabel ?label .
  }

`
