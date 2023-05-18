const clearNestedObject = (obj) => {
  for (let key in obj) {
    if (typeof obj[key] === "string") {
      const cleanedValue = obj[key].replace(/\t/g, "").replace(/\\/g, "");
      try {
        obj[key] = JSON.parse(cleanedValue);
      } catch {}
    } else if (typeof obj[key] === "object") {
      clearNestedObject(obj[key]);
    }
  }
};

exports.clearData = (jsonData) => {
  const parsedData = JSON.parse(jsonData);
  clearNestedObject(parsedData);
  return parsedData;
};
