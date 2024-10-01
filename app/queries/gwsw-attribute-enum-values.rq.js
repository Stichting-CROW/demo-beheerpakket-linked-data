export const query = (classUri) => `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
PREFIX gwsw: <http://data.gwsw.nl/1.6/totaal/>

select distinct ?entry ?Aspect ?Collection ?Waarde 

where {    
 ?coll rdfs:subClassOf gwsw:VerzamelingSoorten .
 ?coll rdfs:subClassOf ?o1 .
 ?o1 owl:oneOf ?list .
 #voer eerst rdf:rest uit, met object vervolgens rdf:first (rest*: doe voor alle rest-relaties)
 ?list rdf:rest*/rdf:first ?elem .
     
 BIND (str(iri(gwsw:)) AS ?aft)
 BIND (strafter(str(?coll), ?aft) AS ?Collection)
 BIND (strafter(str(?elem), ?aft) AS ?Waarde)
 BIND (strafter(str(?coll), ?aft) AS ?coll1)
 BIND (strbefore(str(?coll1), "Coll") AS ?Aspect)
 
 BIND(gwsw:MateriaalHulpstuk AS <${classUri}>)
 <${classUri}> ?predicate ?BlankNode .
 ?BlankNode owl:allValuesFrom ?coll .
 BIND(<${classUri}> AS ?entry)
}
`
