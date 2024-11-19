type Source = {
  name?: string;
  title?: string;
  url: string;
  classRootUrl: string;
  fetchOptions?: any;
};

type Sources = {
  [key: string]: Source
};

type PhysicalObject = {
  classURI: any;
  label: any;
};

type Config = {
  imbor?: any;
  sources: Sources;
}

type Attribute = {
  entry_definition?: any;
  entry_iri?: any;
  entry_text?: any;
  group_iri?: any;
}

export type {
  Config,
  Source,
  Attribute,
  PhysicalObject
}
