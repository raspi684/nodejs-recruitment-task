const map = (mapping: Array<any>, data: any) => {
  const out = {};
  for (const property of mapping) {
    // @ts-ignore
    out[property[1]] = data[property[0]];
  }
  return out;
};

export {
  map,
};
