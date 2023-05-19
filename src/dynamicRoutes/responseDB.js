const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
let responses = [];

const loadResponses = async () => {
  try {
    if (!fs.existsSync("data/responses.json")) {
      fs.writeFileSync("data/responses.json", "[]");
      console.log("responses.json file created.");
    }
    const responsesData = await fs.promises.readFile(
      "data/responses.json",
      "utf8"
    );
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
  fs.writeFile(
    "data/responses.json",
    JSON.stringify(responses),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error saving response file:", err);
      }
    }
  );
};

const addResponse = async (newResponse) => {
  const newId = uuidv4();
  newResponse = {
    ...newResponse,
    id: newId,
  };
  responses.push(newResponse);
  await saveResponses();
  return newId;
};

const deleteResponse = (responseId) => {
  const index = responses.findIndex(
    (response) => String(response.id) === responseId
  );
  if (index !== -1) {
    responses.splice(index, 1);
    saveResponses();
  }
};

const updateResponse = async (updatedResponse) => {
  const index = responses.findIndex(
    (route) => String(route.routeId) == updatedResponse.routeId
  );
  if (index !== -1) {
    responses[index].response = updatedResponse.response;
    saveResponses();
  } else {
    throw new Error("something went wrong!");
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
