export const query = (classUri) => `
  PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl:  <http://www.w3.org/2002/07/owl#>
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
  PREFIX nen2660: <https://w3id.org/nen2660/def#>

  PREFIX sh: <http://www.w3.org/ns/shacl#>
  SELECT DISTINCT ?group_text ?group_iri ?entry_text ?entry_iri ?entry_icon
  WHERE {

    #########################
    # This query returns certain relations for a given concept.
    #
    # INPUT:
    #   <${classUri}>: The IRI of the concept
    #   I.e.: https://data.crow.nl/imbor/def/3835b78e-a396-4e2c-9411-1fc328be3c4f
    #########################

      {
          ?entry a <${classUri}> .

          OPTIONAL {
              <${classUri}> skos:prefLabel ?termLabel 
              FILTER (LANGMATCHES(lang(?termLabel), 'nl'))
          }
      }
      union {
          []
              sh:path <${classUri}> ;
              sh:qualifiedValueShape [
                  sh:class ?group ;
              ] ;
              .

          ?entry a ?group . 
          BIND (?group as ?group_iri)
          # get group name
          OPTIONAL {
              ?group skos:prefLabel ?groupLabel .
              FILTER (LANGMATCHES(lang(?groupLabel), "nl"))
          }
          BIND (IF(contains(str(?group),"#"),strafter(str(?group), "#"),REPLACE(str(?group),"(.*)[//]","")) AS ?groupLocalname) .
          BIND (COALESCE(?groupLabel, ?groupLocalname) AS ?group_text) .
      }
          
      BIND (IF(!bound(?entry),?invalid,?entry) AS ?entry_iri) .
      BIND (IF(!bound(?entry),"(not specified)",?invalid) AS ?noEntryName) .
      BIND (IF(contains(str(?entry),"#"),strafter(str(?entry), "#"),REPLACE(str(?entry),"(.*)[//]","")) AS ?entryLocalname) .
      OPTIONAL {
          ?entry skos:prefLabel ?entryLabel .
          FILTER (LANGMATCHES(lang(?entryLabel), 'nl'))
      }
      BIND (COALESCE(?noEntryName, ?entryLabel, ?entryLocalname) AS ?entry_text) .

      BIND ("icon-term-type" AS ?entry_icon) .
  }
  ORDER BY ?group_text ?group_iri ?entry_text ?entry_iri
`
