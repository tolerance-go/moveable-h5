export const divided = (a, b) => {
  return a / b;
};

export const multiplied = (a, b) => {
  return a * b;
};

export const multipliedObject = (attr, b) => {
  if (Array.isArray(attr)) {
    return attr.map(item => multipliedObject(item, b));
  }

  return Object.keys(attr).reduce((dist, key) => {
    if (typeof dist[key] === 'object') {
      if (Array.isArray(dist[key])) {
        return {
          ...dist,
          [key]: dist[key].map(item => multipliedObject(item, b)),
        };
      }

      return {
        ...dist,
        [key]: multipliedObject(dist[key], b),
      };
    }

    if (typeof dist[key] === 'number') {
      return {
        ...dist,
        [key]: multiplied(dist[key], b),
      };
    }

    return dist;
  }, attr);
};
