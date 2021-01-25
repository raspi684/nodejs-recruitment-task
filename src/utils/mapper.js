module.exports.map = (mapping, data) => {
  const out = {};
  for (const property of mapping) {
    out[property[1]] = data[property[0]];
  }
  return out;
};
