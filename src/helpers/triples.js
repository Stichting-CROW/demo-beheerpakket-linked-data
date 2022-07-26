const makeTriple = (obj) => {
  const get = (key) => obj[key] ? obj[key].value : null;

  let data = {};
  for(let key in obj) {
    data[key] = obj[key];
  }

  return {
    get,
    data
  }
}

const makeBindingsObject = (response) => {
  let objects: any = [];
  Object.keys(response.results.bindings).forEach((key) => {
    const obj = response.results.bindings[key];
    const triple = makeTriple(obj)
    objects.push(triple)
  })
  return objects;
}

export {
  makeTriple,
  makeBindingsObject
}
