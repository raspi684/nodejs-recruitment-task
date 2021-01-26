// Array<[srcProperty, destProperty]>
type mapperType = Array<[string, string]>;

const map = (mapping: mapperType, data: any) => {
  const mappedObject = {};
  for (let i = 0; i < mapping.length; i += 1) {
    const property = mapping[i];
    Object.defineProperty(
        mappedObject,
        property[1],
        {
          value: data[property[0]],
          enumerable: true,
        },
    );
  }
  return mappedObject;
};

export {
  map,
  mapperType,
};
