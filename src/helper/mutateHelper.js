exports.removeElementFromArray = (array, field, value) => {
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i][field] == value) {
      array.splice(i, 1);
    }
  }
};
