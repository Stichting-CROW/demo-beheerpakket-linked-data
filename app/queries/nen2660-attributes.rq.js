export const query = (classUri) => `
  PREFIX nen2660: <https://w3id.org/nen2660/def#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
  PREFIX dash: <http://datashapes.org/dash#>
  PREFIX sh: <http://www.w3.org/ns/shacl#>

  SELECT
    ?entry_iri ?entry_text ?entry_definition ?group_iri
  WHERE {
   	?group_iri sh:property/sh:path ?entry_iri .
    OPTIONAL { ?entry_iri skos:prefLabel ?entry_text . }
    OPTIONAL { ?entry_iri skos:definition ?entry_definition . }
    OPTIONAL { ?entry_iri nen2660:hasQuantityKind/skos:prefLabel ?attributQuantityKind . }
  
  	<${classUri}> rdfs:subClassOf* ?group_iri .
  }
`
