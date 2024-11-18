export const query = (classUri) => `
  PREFIX gwsw: <http://data.gwsw.nl/1.6/totaal/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
  select * 

  where { 
      values $group_iri { <${classUri}> }
      
      $group_iri rdfs:subClassOf+ [
          a owl:Restriction ;
          owl:onClass ?entry_iri ;
          owl:onProperty gwsw:hasAspect ;
      ].
      
      ?entry_iri rdfs:label ?entry_text .
      OPTIONAL {?entry_iri  skos:definition ?entry_definition}
      
  } limit 100 

`
