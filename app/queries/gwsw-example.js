export const query = () => `
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  select * where { 
      VALUES ?object { owl:Class	}
    ?subject ?predicate ?object .
  } limit 99999
`
