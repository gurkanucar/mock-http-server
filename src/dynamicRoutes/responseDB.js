const fs = require("fs");

let responses = [];

const loadResponses = async () => {
  try {
    if (!fs.existsSync("responses.json")) {
      fs.writeFileSync("responses.json", "[]");
      console.log("responses.json file created.");
    }
    const responsesData = await fs.promises.readFile("responses.json", "utf8");
    const parsedResponses = JSON.parse(responsesData);
    responses = parsedResponses;
    return parsedResponses;
  } catch (err) {
    console.error("Error reading responses file:", err);
    return [];
  }
};

const getByRouteId = async (id) => {
  const data = await loadResponses();
  const found = data.find((x) => x.routeId == id);
  return found;
};

const saveResponses = () => {
  fs.writeFile("responses.json", JSON.stringify(responses), "utf8", (err) => {
    if (err) {
      console.error("Error saving response file:", err);
    }
  });
};

const addResponse = async (newResponse) => {
  const lastResponse = responses[responses.length - 1];
  const newId = lastResponse ? lastResponse.id + 1 : 1;
  newResponse = {
    ...newResponse,
    id: newId,
  };
  responses.push(newResponse);
  await saveResponses();
  return newId;
};

const deleteResponse = (responseId) => {
  const index = responses.findIndex((response) => response.id === responseId);
  if (index !== -1) {
    responses.splice(index, 1);
    saveResponses();
  }
};

const updateResponse = (updatedResponse) => {
  const index = responses.findIndex((route) => route.id === updatedResponse.id);
  if (index !== -1) {
    responses[index] = updatedResponse;
    saveResponses();
  }
};

module.exports = {
  addResponse,
  saveResponses,
  deleteResponse,
  updateResponse,
  loadResponses,
  getByRouteId,
};
