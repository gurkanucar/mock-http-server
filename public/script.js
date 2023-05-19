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
        <td class="text-center" style="width: 220px;">
          <button class="btn btn-danger delete-button mx-2" data-route-id="${route.id}">Delete</button>
          <button class="btn btn-primary edit-button mx-2" data-route-id="${route.id}">Edit</button>
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

    const responseTypeOptions = ["RANDOM_ERROR", "RETURN_ERROR", "SUCCESS"];
    populateSelectOptions(responseTypeSelect, responseTypeOptions);

    const apiTypeOptions = ["REST", "SOAP"];
    populateSelectOptions(apiTypeSelect, apiTypeOptions);

    fetchRoutes();
  });

  $(document).ready(function () {
    $("#responseHelper").click(function () {
      $("#myModal").modal("show");
      $("#successStatusInput").val("200");
      $("#errorStatusInput").val("400");
    });
  });

  $(document).ready(function () {
    const setResponseBtn = $("#setResponseBtn");
    const successResponseInput = $("#successResponseInput");
    const errorResponseInput = $("#errorResponseInput");
    const successStatusInput = $("#successStatusInput");
    const errorStatusInput = $("#errorStatusInput");
    const responseInput = $("#response");

    setResponseBtn.on("click", function () {
      const successResponse = successResponseInput.val();
      const errorResponse = errorResponseInput.val();
      const successStatus = successStatusInput.val();
      const errorStatus = errorStatusInput.val();

      if (
        successResponse === "" ||
        errorResponse === "" ||
        successStatus === "" ||
        errorStatus === ""
      ) {
        alert("Please fill in all the required fields.");
        return;
      }

      console.log(successResponse, errorResponse, successStatus, errorStatus);

      responseInput.val(
        JSON.stringify({
          data: successResponse,
          error: errorResponse,
          successStatus: successStatus,
          errorStatus: errorStatus,
        })
      );

      $("#myModal").modal("hide");
    });

    // Reset input fields when modal is closed
    $("#myModal").on("hidden.bs.modal", function () {
      successResponseInput.val("");
      errorResponseInput.val("");
      successStatusInput.val("");
      errorStatusInput.val("");
    });
  });
});
