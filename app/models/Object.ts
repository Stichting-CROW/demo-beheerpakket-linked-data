export type UUID = string;
export type URL = string;
export type Point = any;

// https://pro.arcgis.com/en/pro-app/2.8/arcpy/classes/geometry.htm#S2_GUID-BC466D06-360C-42BD-B198-DA4139B45F49
export type Geometry = {
  geometry: string,// point, polygon, polyline, or multipoint
  inputs: Point | object// The coordinates used to create the object. The data type can be either Point or Array objects
};
export type Literal = string | boolean | number | any;

export class AttributeRelationValue<T extends Literal | URL> {
  // URI van attribuut
  uri: string | object;
  // Verwijst  naar IMBOR (of andere ontologie), wel stabiel
  type: URL;
  // Bij relaties een URL, bij attributen een Literal
  value: T;
  // Label van type (bijvoorbeeld "snoeifrequentie")
  label?: string;
  // Misschien niet nodig? t.b.v. datums die als strings worden geserialiseerd
  jsType?: string;
}

export type Object = {
  uri: string;
  label: string;
  description?: string; // label van type komt uit IMBOR (niet stabiel), eigen naam bij this.annotations

  // PK van het individuele object, hoeft niet een URL te zijn.
  uuid: UUID;
  // Verwijst naar IMBOR (of andere ontologie), wel stabiel in IMBOR, zoals "Boom".
  type: URL;
  // Opslag van geometrie
  geometry: Geometry;
  // Lijst van attributen, zoals "snoeifrequentie"
  attributes?: AttributeRelationValue<Literal>[];
  // Lijst van relaties, zoals nen2660:hasPart.
  relations?: AttributeRelationValue<URL>[];
  // Lijst van annotaties, voor bijvoorbeeld skos:prefLabel en skos:description
  annotations?: AttributeRelationValue<Literal>[];
}
