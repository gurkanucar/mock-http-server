const setSelectOptions = (selectElement, options) => {
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
  setSelectOptions(httpMethodSelect, httpMethodOptions);

  const responseTypeOptions = ["RANDOM_ERROR", "RETURN_ERROR", "SUCCESS"];
  setSelectOptions(responseTypeSelect, responseTypeOptions);

  const apiTypeOptions = ["REST", "SOAP"];
  setSelectOptions(apiTypeSelect, apiTypeOptions);
});

$(document).ready(function () {
  const addRouteForm = $("#addRouteForm");

  $("#clearBtn").on("click", function () {
    addRouteForm.trigger("reset");
  });

  addRouteForm.on("submit", function (event) {
    event.preventDefault();
    const newRoute = getFormData();

    const routeId = addRouteForm.data("route-id");
    if (routeId) {
      updateRoute(routeId, newRoute);
      addRouteForm.removeData("route-id");
      $("#addRouteBtn").show();
      $("#updateRouteBtn").hide();
    } else {
      addRoute(newRoute);
    }

    fetchRoutes();
    addRouteForm.trigger("reset");
  });

  const getFormData = () => {
    const routeName = $("#routeName").val();
    const httpMethod = $("#httpMethod").val();
    const routePath = $("#routePath").val();
    const responseType = $("#responseType").val();
    const apiType = $("#apiType").val();
    const successResponse = $("#successResponse").val();
    const errorResponse = $("#errorResponse").val();
    const successStatus = $("#successStatus").val();
    const errorStatus = $("#errorStatus").val();
    const delay = $("#delay").val();

    return {
      routeName,
      httpMethod,
      routePath,
      responseType,
      apiType,
      delay,
      successResponse,
      errorResponse,
      successStatus,
      errorStatus,
    };
  };

  const addRoute = (newRoute) => {
    $.ajax({
      url: "/route",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(newRoute),
      success: () => {},
      error: () => {
        console.error("Error adding route.");
      },
    });
  };

  const updateRoute = (routeId, updatedRoute) => {
    $.ajax({
      url: `/route/${routeId}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(updatedRoute),
      success: () => {
        console.log("Route updated successfully.");
      },
      error: (e) => {
        console.error("Error updating route.", e);
      },
    });
  };

  const fetchRoutes = () => {
    $.ajax({
      url: "/route",
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
        <td>${route.delay}</td>
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
  $("#routesTableBody").on("click", ".edit-button", function () {
    const routeId = $(this).data("route-id");
    const route = getRouteById(routeId);
    if (route) {
      updateFormData(route);
      $("#addRouteBtn").hide();
      $("#updateRouteBtn").show();
    }
  });

  const deleteRoute = (routeId) => {
    $.ajax({
      url: `/route/${routeId}`,
      type: "DELETE",
      success: () => {
        console.log("Route deleted successfully.");
        fetchRoutes();
      },
      error: (e) => {
        console.error("Error deleting route.", e);
      },
    });
  };

  const getRouteById = (routeId) => {
    let route;
    $.ajax({
      url: `/route/${routeId}`,
      type: "GET",
      async: false,
      success: (response) => {
        route = response;
      },
      error: (e) => {
        console.error("Error getting route by ID.", e);
      },
    });
    return route;
  };

  const updateFormData = (route) => {
    $("#routeName").val(route.routeName);
    $("#httpMethod").val(route.httpMethod);
    $("#routePath").val(route.routePath);
    $("#responseType").val(route.responseType);
    $("#apiType").val(route.apiType);
    $("#successResponse").val(route.successResponse);
    $("#errorResponse").val(route.errorResponse);
    $("#successStatus").val(route.successStatus);
    $("#errorStatus").val(route.errorStatus);
    $("#delay").val(route.delay);

    addRouteForm.data("route-id", route.id);
  };

  fetchRoutes();
});
