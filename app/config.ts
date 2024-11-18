import {Config} from './types';

const config: Config = {
  imbor: {
    // vocabulaire: 'https://hub.laces.tech/crow/imbor/2022/p/vocabulaire/sparql',
    kern: 'https://hub.laces.tech/crow/imbor/2022/p/kern/sparql',
    kern_informatief: 'https://hub.laces.tech/crow/imbor/2022/p/kern/sparql?&default-graph-uri=https://hub.laces.tech/crow/imbor/2022/p/informatief',
    gwsw_basis_v161: 'https://sparql.gwsw.nl/repositories/GWSW_Dataset_v161'
  },
  sources: {
    "imbor_kern": {
      name: "imbor_kern",
      title: "IMBOR kern",
      url: "https://hub.laces.tech/crow/imbor/2022/p/kern/sparql",
      fetchOptions: {
        method: "get",
        headers: {
          "Content-Type": 'application/sparql-query',
          "authorization": `Basic ${process.env.NEXT_PUBLIC_IMBOR_TOKEN}`
        }
      }
    },
    "gwsw_basis_v161": {
      name: "gwsw_basis_v161",
      title: "GWSW Basis v1.6.1",
      url: "https://sparql.gwsw.nl/repositories/GWSW_Dataset_v161",
      fetchOptions: {
        method: "post",
        headers: {
          "Accept": 'application/x-sparqlstar-results+json, application/sparql-results+json;q=0.9, */*;q=0.8',
          "Content-Type": 'application/x-www-form-urlencoded'
        }
      }
    }
  }
}

export {config}
