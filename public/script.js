const addRouteForm = document.getElementById("addRouteForm");

addRouteForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const newRoute = getFormData();
  addRoute(newRoute);
  fetchRoutes();
  addRouteForm.reset();
});

const getFormData = () => {
  const routeName = document.getElementById("routeName").value;
  const httpMethod = document.getElementById("httpMethod").value;
  const routePath = document.getElementById("routePath").value;
  const responseType = document.getElementById("responseType").value;
  const apiType = document.getElementById("apiType").value;
  const responseData = document.getElementById("response").value;

  return {
    routeName,
    httpMethod,
    routePath,
    responseType,
    apiType,
    responseData,
  };
};

const addRoute = (newRoute) => {
  fetch("/routes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newRoute),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error adding route.");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

const fetchRoutes = () => {
  fetch("/routes")
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Error fetching routes.");
    })
    .then((routes) => {
      renderRoutesTable(routes);
    })
    .catch((error) => {
      console.error(error);
    });
};

const renderRoutesTable = (routes) => {
  if (!Array.isArray(routes)) {
    console.error("Invalid routes data.");
    return;
  }

  routesTableBody.innerHTML = "";

  routes.forEach((route) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${route.routeName}</td>
        <td>${route.httpMethod}</td>
        <td>${route.routePath}</td>
        <td>${route.responseType}</td>
        <td>${route.apiType}</td>
        <td>
          <button class="delete-button" data-route-id="${route.id}">Delete</button>
        </td>
      `;
    routesTableBody.appendChild(row);
  });
};

routesTableBody.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-button")) {
    const routeId = event.target.getAttribute("data-route-id");
    deleteRoute(routeId);
  }
});

const deleteRoute = (routeId) => {
  fetch(`/routes/${routeId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error deleting route.");
      }
    })
    .then(() => {
      fetchRoutes();
    })
    .catch((error) => {
      console.error(error);
    });
};

const populateSelectOptions = (selectElement, options) => {
  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    selectElement.appendChild(optionElement);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const httpMethodSelect = document.getElementById("httpMethod");
  const responseTypeSelect = document.getElementById("responseType");
  const apiTypeSelect = document.getElementById("apiType");

  const httpMethodOptions = ["GET", "POST", "PUT", "PATCH", "DELETE"];
  populateSelectOptions(httpMethodSelect, httpMethodOptions);

  const responseTypeOptions = ["RETURN_ERROR", "RANDOM_ERROR", "SUCCESS"];
  populateSelectOptions(responseTypeSelect, responseTypeOptions);

  const apiTypeOptions = ["REST", "SOAP"];
  populateSelectOptions(apiTypeSelect, apiTypeOptions);

  fetchRoutes();
});
