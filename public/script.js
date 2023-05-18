$(document).ready(function () {
  const addRouteForm = $("#addRouteForm");

  addRouteForm.on("submit", function (event) {
    event.preventDefault();
    const newRoute = getFormData();
    addRoute(newRoute);
    fetchRoutes();
    addRouteForm.trigger("reset");
  });

  const getFormData = () => {
    const routeName = $("#routeName").val();
    const httpMethod = $("#httpMethod").val();
    const routePath = $("#routePath").val();
    const responseType = $("#responseType").val();
    const apiType = $("#apiType").val();
    const responseData = $("#response").val();

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
    $.ajax({
      url: "/routes",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(newRoute),
      success: () => {},
      error: () => {
        console.error("Error adding route.");
      },
    });
  };

  const fetchRoutes = () => {
    $.ajax({
      url: "/routes",
      type: "GET",
      success: (routes) => {
        renderRoutesTable(routes);
      },
      error: () => {
        console.error("Error fetching routes.");
      },
    });
  };

  const renderRoutesTable = (routes) => {
    if (!Array.isArray(routes)) {
      console.error("Invalid routes data.");
      return;
    }

    const routesTableBody = $("#routesTableBody");
    routesTableBody.empty();

    routes.forEach((route) => {
      const row = $("<tr></tr>");
      row.html(`
        <td>${route.routeName}</td>
        <td>${route.httpMethod}</td>
        <td>${route.routePath}</td>
        <td>${route.responseType}</td>
        <td>${route.apiType}</td>
        <td>
          <button class="delete-button" data-route-id="${route.id}">Delete</button>
        </td>
      `);
      routesTableBody.append(row);
    });
  };

  $("#routesTableBody").on("click", ".delete-button", function () {
    const routeId = $(this).data("route-id");
    deleteRoute(routeId);
  });

  const deleteRoute = (routeId) => {
    $.ajax({
      url: `/routes/${routeId}`,
      type: "DELETE",
      success: function () {
        fetchRoutes();
      },
      error: function () {
        console.error("Error deleting route.");
      },
    });
  };

  const populateSelectOptions = (selectElement, options) => {
    options.forEach((option) => {
      const optionElement = $("<option></option>");
      optionElement.val(option);
      optionElement.text(option);
      selectElement.append(optionElement);
    });
  };

  $(document).ready(function () {
    const httpMethodSelect = $("#httpMethod");
    const responseTypeSelect = $("#responseType");
    const apiTypeSelect = $("#apiType");

    const httpMethodOptions = ["GET", "POST", "PUT", "PATCH", "DELETE"];
    populateSelectOptions(httpMethodSelect, httpMethodOptions);

    const responseTypeOptions = ["RETURN_ERROR", "RANDOM_ERROR", "SUCCESS"];
    populateSelectOptions(responseTypeSelect, responseTypeOptions);

    const apiTypeOptions = ["REST", "SOAP"];
    populateSelectOptions(apiTypeSelect, apiTypeOptions);

    fetchRoutes();
  });

  const responseHelperButton = $("#responseHelper");
  const setResponseBtn = $("#setResponseBtn");

  responseHelperButton.on("click", function () {
    $("#dialog").dialog();
  });

  setResponseBtn.on("click", function () {
    const successResponseInput = $("#successResponseInput").val();
    const errorResponseInput = $("#errorResponseInput").val();
    const successStatusInput = $("#successStatusInput").val();
    const errorStatusInput = $("#errorStatusInput").val();

    if (
      successResponseInput === "" ||
      errorResponseInput === "" ||
      successStatusInput === "" ||
      errorStatusInput === ""
    ) {
      alert("Please fill required fields.");
      return;
    }

    console.log(
      successResponseInput,
      errorResponseInput,
      successStatusInput,
      errorStatusInput
    );

    $("#response").val(
      JSON.stringify({
        data: successResponseInput,
        error: errorResponseInput,
        successStatus: successStatusInput,
        errorStatus: errorStatusInput,
      })
    );

    $("#dialog").dialog("close");
  });
});
