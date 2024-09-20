type Source = {
  name?: string
  title?: string
  url: string
  fetchOptions?: any
};

type Sources = {
  [key: string]: Source
};

type Config = {
  imbor?: any;
  sources: Sources;
}

export type {
  Config,
  Source
}
