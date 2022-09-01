export const query = () => `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
  PREFIX sh: <http://www.w3.org/ns/shacl#>
  PREFIX nen2660: <https://w3id.org/nen2660/def#> 

  SELECT ?classURI ?geoKlasseURI ?geoKlasseLabel
  WHERE {
  # Selecteer per Klasse de Shape ...
      ?classURI sh:property ?propertyShape .
  #...en dan alleen diegene die als path een nen2660:hasBoundary hebben en waar de minCount 1 is.
        ?propertyShape sh:path nen2660:hasBoundary .
   	  ?propertyShape sh:qualifiedMinCount 1 .
  # Presenteer ook de URI van de geometrische klasse ...
        ?propertyShape sh:qualifiedValueShape/sh:class ?geoKlasseURI .
  # ... en zoek daar het Label bij.       
        ?geoKlasseURI skos:prefLabel ?geoKlasseLabel .
  } 
`
