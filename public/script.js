document.addEventListener("DOMContentLoaded", function () {
  const routesTableBody = document.getElementById("routesTableBody");
  const addRouteForm = document.getElementById("addRouteForm");

  // Add Route Form Submission
  addRouteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const routeName = document.getElementById("routeName").value;
    const httpMethod = document.getElementById("httpMethod").value;
    const routePath = document.getElementById("routePath").value;
    const responseType = document.getElementById("responseType").value;
    const apiType = document.getElementById("apiType").value;

    const newRoute = {
      routeName,
      httpMethod,
      routePath,
      responseType,
      apiType,
    };

    fetch("/routes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRoute),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Error adding route.");
      })
      .then((routes) => {
        renderRoutesTable(routes);
      })
      .catch((error) => {
        console.error(error);
      });

    addRouteForm.reset();
  });

  // Delete Route Button Click
  routesTableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-button")) {
      const routeId = event.target.getAttribute("data-route-id");

      fetch(`/routes/${routeId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Error deleting route.");
        })
        .then((routes) => {
          renderRoutesTable(routes);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });

  // Fetch and render routes
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

  // Render routes table
  function renderRoutesTable(routes) {
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
  }
});
