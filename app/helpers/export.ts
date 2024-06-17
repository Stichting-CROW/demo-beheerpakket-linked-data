import { getDataStore } from "./dataStore";

// Import models
import type {
  Object,
  AttributeRelationValue
} from '../models/Object';

export const generateExport = () => {
  let txt = `
    @prefix imbor:              <https://data.crow.nl/imbor/def/> .
    @prefix imbor-domeinwaarde: <https://data.crow.nl/imbor/id/domeinwaarden/> .
    @prefix nen2660:            <https://w3id.org/nen2660/def#> .
    
    @prefix rdf:                <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix geo:                <http://www.opengis.net/ont/geosparql#> .
    @prefix xsd:                <http://www.w3.org/2001/XMLSchema#> .
    @prefix sh:                 <http://www.w3.org/ns/shacl#> .
    @prefix owl:                <http://www.w3.org/2002/07/owl#> .
    @prefix sh:                 <http://www.w3.org/ns/shacl#> .
    
    @prefix data:               <http://example.com/gemeente/areaaldata/id/> .
    
    data: a owl:Ontology ;
            # owl:imports <C:/GitHub/imbor/data/imbor-gecombineerd-tbv-shaclvalidatie.ttl> ; # Hier wordt de IMBOR ontologie + alle afhankelijkheden aangeduidt. Dit pad zal dus verschillen. 
            # owl:imports <https://hub.laces.tech/crow/imbor/2022/p/kern/> ;
        #   owl:imports <C:/GitHub/imbor/data/imbor-kern.ttl> ;
            # owl:imports <C:/GitHub/imbor/data/imbor-domeinwaarden.ttl> ;
        #   owl:imports <https://entvmg21zqn5.x.pipedream.net>;
            owl:imports <https://w3id.org/nen2660/> ;
            owl:imports <https://data.crow.nl/imbor/def/> ;
            owl:imports <https://data.crow.nl/imbor/id/domeinwaarden/> ;
            .
  `;

  // Get physical objects from data store
  const dataStore = getDataStore();
  Object.keys(dataStore).forEach(uuid => {
    txt += generatePhysicalObject(dataStore[uuid]);
  });

  return txt;
}

const generatePhysicalObject = (data: Object) => {
  let txt = '';

  txt += `
    data:${data.uuid} a imbor:83a942f7-5291-42f0-afb1-9a57d0fb2f15 ; #'${data.label}'
    nen2660:hasBoundary 
    #  geo:hasGeometry
    [
        a geo:Geometry ;
        a imbor:bdb53bb7-defc-4055-b047-271c5edda82a ; #GM_Point
        geo:asWKT "<http://www.opengis.net/def/crs/EPSG/0/28992>POINT((${data.geometry.inputs[1]} ${data.geometry.inputs[0]}))"^^geo:wktLiteral ;
    ]    ; #'geometrie'
`;

  // Generate attributes
  data.attributes?.forEach((attribute) => {
    txt += `    ${attribute.uri.value} "${attribute.value}" ; #'${attribute.label}'
`;
  });
  
  txt += `    .
`;
  
  return txt;
}

// Example export from https://github.com/Stichting-CROW/imbor/blob/master/docs/uitwisseling_rdf/files/ld_files/IMBOR_Exchange_Sample.ttl
// 
// data:6fb4b2c7-69ec-4976-8489-6ad2d35d9e63 a imbor:83a942f7-5291-42f0-afb1-9a57d0fb2f15 ; #'Boom'
// nen2660:hasBoundary 
// #  geo:hasGeometry
// [
//     a geo:Geometry ;
//     a imbor:bdb53bb7-defc-4055-b047-271c5edda82a ; #GM_Point
//     geo:asWKT "<http://www.opengis.net/def/crs/EPSG/0/28992>POINT((185654.51397226387 427926.8653074717))"^^geo:wktLiteral ;
// ]    ; #'geometrie'
// imbor:4e721262-e6e2-41df-bb99-0b6693e32435 imbor-domeinwaarde:01a31554-111c-4765-82cb-79f0b178eb8e   ; #'status' (In gebruik)
// imbor:5f430c8d-7503-4a69-9e2f-f0b6e6c7f54e "6fb4b2c7-69ec-4976-8489-6ad2d35d9e63"  ; #'identificatie'
// imbor:e0259ff5-4d44-4d5f-9fbf-666819ed78a5 "http://example.com/gemeente/areaaldata/"^^xsd:anyURI    ; #'domein' (Voorbeeld gemeente data)
// imbor:662b5093-40d8-4947-892e-1a33b691eee6 "2014-03-04T09:10:00"^^xsd:dateTime   ; #'tijdstipRegistratie'
// imbor:359bc182-da82-4ece-a924-60f71ab10ccd imbor-domeinwaarde:bb4f0add-edcd-4094-8752-5f1864913531    ; #'eigenaar' (Gemeente)
// imbor:6fb28421-21d5-48b3-9b85-867e6b6576a8 true    ; #'in onderzoek'
// imbor:ee97b257-d3b8-4d0c-9a42-c07d88b36d9f "Boom5238"    ; #'objectnaam'
// imbor:fe4e8ac7-4e55-4641-a288-330526cc8be9 "6.7"^^xsd:decimal   ; #'boomhoogte actueel'
// imbor:e951cd0e-0ba1-4bf7-a39d-3d2a6691eaad "P55Y"^^xsd:duration    ; #'leeftijd' (55)

// nen2660:hasPart data:9a6f7b7f-db55-4929-b87d-ff0d7d1a6998 ; #'Boom heeft deel Armatuur'
// nen2660:isConnectedTo data:a946356a-21ec-4be0-9c14-631786921d3a ;  #'Boom is verbonden met Groeiplaatsinrichting'
// .

// data:6daaff3c-abf4-49e2-9904-a7a11b57d878 a imbor:d61e45b1-3651-4c01-9c63-b9bfadf25a16 ; #'Hek'
// nen2660:hasBoundary 
// #  geo:hasGeometry
// [
//     a geo:Geometry ;
//     a imbor:f8e7183c-e1ec-40c4-b0b0-c77052851b30 ; #GM_Curve
//     geo:asWKT "<http://www.opengis.net/def/crs/EPSG/0/28992>LINESTRING((185645.92744215365 427930.2478799394,185670.2559441326 427909.3019504281,185695.56018816953 427936.4275796399))"^^geo:wktLiteral ;
// ]    ; #'geometrie'
// imbor:4e721262-e6e2-41df-bb99-0b6693e32435 imbor-domeinwaarde:d759852d-910a-4faa-90c3-20ee9745925f   ; #'status' (In aanleg)
// imbor:5f430c8d-7503-4a69-9e2f-f0b6e6c7f54e "6daaff3c-abf4-49e2-9904-a7a11b57d878"   ; #'identificatie'
// imbor:e0259ff5-4d44-4d5f-9fbf-666819ed78a5 "http://example.com/gemeente/areaaldata/"^^xsd:anyURI    ; #'domein' (Voorbeeld gemeente data)
// imbor:662b5093-40d8-4947-892e-1a33b691eee6 "2022-04-18T18:00:00"^^xsd:dateTime   ; #'tijdstipRegistratie'
// imbor:359bc182-da82-4ece-a924-60f71ab10ccd imbor-domeinwaarde:bb4f0add-edcd-4094-8752-5f1864913531    ; #'eigenaar' (Gemeente)
// imbor:6fb28421-21d5-48b3-9b85-867e6b6576a8 false    ; #'in onderzoek'
// imbor:ee97b257-d3b8-4d0c-9a42-c07d88b36d9f "Hek_kompark_speeltuin"    ; #'objectnaam'
// imbor:e3e112b3-e46f-45c4-b2c9-b152e6f805a1 imbor-domeinwaarde:e27995f4-4464-4b72-b593-14ec62dde8b7 ; #'type' (Buishek)
// imbor:1b21b51b-ba59-4a4e-80de-4953c26e56f2 false ; #'verplaatsbaar'
// imbor:9c9347bf-7d12-40de-83e7-7ca020007747 imbor-domeinwaarde:e5df77f1-a3e8-4f03-9967-3f76e42475ed ; #'hoogteklasse hek' (1 tot 1,5 m.)
// .

// data:4db2734b-2295-4030-a349-9b5b2804c20 a imbor:941a17c1-a2b2-4cd1-8991-08b0ebcf0c2a ; #'Speelterrein'
// nen2660:hasBoundary 
// #  geo:hasGeometry
// [
//     a geo:Geometry ;
//     a imbor:e995a2d7-b1a2-43c5-a8bc-9ef148c309e6 ; #GM_Surface
//     geo:asWKT "<http://www.opengis.net/def/crs/EPSG/0/28992>POLYGON((185698.1621669908 427934.5411449945,185671.55693354324 427905.91937796044,185698.81266169614 427880.8753318056,185705.9030539841 427888.4861198579,185709.7409727455 427892.909483854,185706.61859815996 427896.2920563217,185706.42344974837 427906.2446253131,185717.4818597388 427916.1971943045,185698.1621669908 427934.5411449945))"^^geo:wktLiteral ;
// ]    ; #'geometrie'
// imbor:4e721262-e6e2-41df-bb99-0b6693e32435 imbor-domeinwaarde:01a31554-111c-4765-82cb-79f0b178eb8e   ; #'status' (In gebruik)
// imbor:5f430c8d-7503-4a69-9e2f-f0b6e6c7f54e "4db2734b-2295-4030-a349-9b5b2804c20"    ; #'identificatie'
// imbor:e0259ff5-4d44-4d5f-9fbf-666819ed78a5 "http://example.com/gemeente/areaaldata/"^^xsd:anyURI    ; #'domein' (Voorbeeld gemeente data)
// imbor:662b5093-40d8-4947-892e-1a33b691eee6 "2013-04-17T14:31:45"^^xsd:dateTime   ; #'tijdstipRegistratie'
// imbor:359bc182-da82-4ece-a924-60f71ab10ccd imbor-domeinwaarde:bb4f0add-edcd-4094-8752-5f1864913531    ; #'eigenaar' (Gemeente)
// imbor:6fb28421-21d5-48b3-9b85-867e6b6576a8 false    ; #'in onderzoek'
// imbor:ee97b257-d3b8-4d0c-9a42-c07d88b36d9f "Speeltuin Kometenpark"    ; #'objectnaam'
// imbor:ace7a70e-3776-4953-8068-9a01c1988678 imbor-domeinwaarde:52bae571-4d4f-4895-a4e6-5cfc5e4f9483 ; #'leeftijd doelgroep' (tot 5 jaar)
// imbor:69d8e370-8849-47b7-8c30-ad37cc64c3c5 "2017"^^xsd:gYear ; #'jaar herinrichting'
// .

// data:9a6f7b7f-db55-4929-b87d-ff0d7d1a6998 a imbor:38a36b34-a593-499d-b210-0c48fb40ca3b ; #'Armatuur'
// nen2660:hasBoundary 
// #  geo:hasGeometry
// [
//     a geo:Geometry ;
//     a imbor:bdb53bb7-defc-4055-b047-271c5edda82a ; #GM_Point
//     geo:asWKT "<http://www.opengis.net/def/crs/EPSG/0/28992>POINT((185654.513972263870528 427926.865307471714914))"^^geo:wktLiteral ;
// ]    ; #'geometrie'
// imbor:4e721262-e6e2-41df-bb99-0b6693e32435 imbor-domeinwaarde:d759852d-910a-4faa-90c3-20ee9745925f   ; #'status' (In aanleg)
// imbor:5f430c8d-7503-4a69-9e2f-f0b6e6c7f54e "9a6f7b7f-db55-4929-b87d-ff0d7d1a6998"  ; #'identificatie'
// imbor:e0259ff5-4d44-4d5f-9fbf-666819ed78a5 "http://example.com/gemeente/areaaldata/"^^xsd:anyURI    ; #'domein' (Voorbeeld gemeente data)
// imbor:662b5093-40d8-4947-892e-1a33b691eee6 "2019-05-04T09:10:00"^^xsd:dateTime   ; #'tijdstipRegistratie'
// imbor:359bc182-da82-4ece-a924-60f71ab10ccd imbor-domeinwaarde:bb4f0add-edcd-4094-8752-5f1864913531    ; #'eigenaar' (Gemeente)
// imbor:6fb28421-21d5-48b3-9b85-867e6b6576a8 true    ; #'in onderzoek'
// imbor:ee97b257-d3b8-4d0c-9a42-c07d88b36d9f "Armatuur5238.1"    ; #'objectnaam'
// imbor:975ce0e7-39b8-41d0-9f9d-63bc4144c9d1 "2"^^xsd:positiveInteger	; #'aantal connectoren'
// .

// data:a946356a-21ec-4be0-9c14-631786921d3a a imbor:9d932904-c4b1-44e0-b151-b6df78f44a92 ; #'Groeiplaatsinrichting'
// nen2660:hasBoundary 
// #  geo:hasGeometry
// [
//     a geo:Geometry ;
//     a imbor:e995a2d7-b1a2-43c5-a8bc-9ef148c309e6 ; #GM_Surface
//     geo:asWKT "<http://www.opengis.net/def/crs/EPSG/0/28992>POLYGON((185653.887835778441513 427929.748094374896027,185651.230945974035421 427927.041074574226514,185654.13848575996235 427924.23379478091374,185656.895635556982597 427927.442114544683136,185653.887835778441513 427929.748094374896027))"^^geo:wktLiteral ;
// ]    ; #'geometrie'
// imbor:4e721262-e6e2-41df-bb99-0b6693e32435 imbor-domeinwaarde:01a31554-111c-4765-82cb-79f0b178eb8e   ; #'status' (In gebruik)
// imbor:5f430c8d-7503-4a69-9e2f-f0b6e6c7f54e "a946356a-21ec-4be0-9c14-631786921d3a"    ; #'identificatie'
// imbor:e0259ff5-4d44-4d5f-9fbf-666819ed78a5 "http://example.com/gemeente/areaaldata/"^^xsd:anyURI    ; #'domein' (Voorbeeld gemeente data)
// imbor:662b5093-40d8-4947-892e-1a33b691eee6 "2013-03-17T14:31:45"^^xsd:dateTime   ; #'tijdstipRegistratie'
// imbor:359bc182-da82-4ece-a924-60f71ab10ccd imbor-domeinwaarde:bb4f0add-edcd-4094-8752-5f1864913531    ; #'eigenaar' (Gemeente)
// imbor:6fb28421-21d5-48b3-9b85-867e6b6576a8 false    ; #'in onderzoek'
// imbor:ee97b257-d3b8-4d0c-9a42-c07d88b36d9f "gpi5238"    ; #'objectnaam'
// imbor:9cb773dc-9846-481e-9e1f-951872d669cb false	; #'verdichting'
// .
