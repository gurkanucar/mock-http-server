exports.ResponseType = {
  RETURN_ERROR: "RETURN_ERROR",
  RANDOM_ERROR: "RANDOM_ERROR",
  SUCCESS: "SUCCESS",
};

exports.HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

exports.ApiType = {
  REST: "REST",
  SOAP: "SOAP",
};

exports.handleResponseType = (res, responseType) => {
  if (responseType === this.ResponseType.RETURN_ERROR) {
    throw new Error("Custom error message");
  } else if (responseType === this.ResponseType.RANDOM_ERROR) {
    const randomNum = Math.random();
    if (randomNum < 0.5) {
      throw new Error("Random error occurred");
    }
  }
};

exports.shouldThrowError = (responseType = this.ResponseType.SUCCESS) => {
  if (responseType === this.ResponseType.RETURN_ERROR) {
    return true;
  } else if (responseType === this.ResponseType.RANDOM_ERROR) {
    const randomNum = Math.random();
    if (randomNum < 0.5) {
      return true;
    }
  }
  return false;
};
