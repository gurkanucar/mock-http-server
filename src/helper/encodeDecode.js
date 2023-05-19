exports.base64Encode = (str) => {
    const buffer = Buffer.from(str, "utf-8");
    return buffer.toString("base64");
  };
  
  exports.base64Decode = (encodedStr) => {
    const buffer = Buffer.from(encodedStr, "base64");
    return buffer.toString("utf-8");
  };
  
// exports.base64Encode = (str) => {
//   return btoa(str);
// };
// exports.base64Decode = (encodedStr) => {
//   return atob(encodedStr);
// };
