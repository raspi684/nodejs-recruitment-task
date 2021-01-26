// Array<[srcProperty, destProperty]>
type KeyMapperType = Array<[string, string]>;

const keyMapper = <T1 = any, T2 = any>(mapping: KeyMapperType, data: T1): T2 => {
  const mappedObject = {};
  for (let i = 0; i < mapping.length; i += 1) {
    const property = mapping[i];
    Object.defineProperty(
      mappedObject,
      property[1],
      {
        // @ts-ignore
        value: data[property[0]],
        enumerable: true,
      },
    );
  }
  return mappedObject as T2;
};

export {
  keyMapper,
  KeyMapperType,
};
