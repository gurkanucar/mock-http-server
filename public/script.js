const setSelectOptions = (selectElement, options) => {
  options.forEach((option) => {
    const optionElement = $("<option></option>");
    optionElement.val(option);
    optionElement.text(option);
    selectElement.append(optionElement);
  });
};

$(document).ready(() => {
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

const renderRoutesTable = (routes, prefix) => {
  if (!Array.isArray(routes)) {
    console.error("Invalid routes data.");
    return;
  }

  const routesTableBody = $("#routesTableBody");
  routesTableBody.empty();

  let isRabbitActionSupport = rabbitActionSupport();

  routes.forEach((route) => {
    const row = $("<tr></tr>");

    let buttons = `
    <button class="btn btn-danger delete-button mx-1" data-route-id="${route.id}">Delete</button>
    <button class="btn btn-primary edit-button mx-1" data-route-id="${route.id}">Edit</button>
`;

    if (isRabbitActionSupport) {
      buttons =
        ` <button class="btn btn-warning rabbit-button mx-1" data-route-id="${route.id}">Rabbit</button> ` +
        buttons;
    }

    row.html(`
      <td>${route.routeName}</td>
      <td>${route.httpMethod}</td>
      <td><strong>${prefix}</strong>${route.routePath}</td>
      <td>${route.responseType}</td>
      <td>${route.apiType}</td>
      <td>${route.delay}</td>
      <td class="text-center" style="width: auto;">
        ${buttons}
      </td>
    `);
    routesTableBody.append(row);
  });
};

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
      addRouteForm.trigger("reset");
    } else {
      addRoute(newRoute);
      addRouteForm.trigger("reset");
    }

    fetchRoutes();
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

  const retrieveRabbitActionData = () => {
    const exchangeType = $("#exchangeType").val();
    const queueName = $("#queueName").val();
    const routingKey = $("#routingKey").val();
    const message = $("#message").val();
    const headers = $("#headers").val();

    return { exchangeType, queueName, routingKey, message, headers };
  };

  const setRabbitActionData = (data) => {
    $("#exchangeType").val(data.exchangeType || "");
    $("#queueName").val(data.queueName || "");
    $("#routingKey").val(data.routingKey || "");
    $("#message").val(data.message || "");
    $("#headers").val(data.headers || "");
  };

  $("#routesTableBody").on("click", ".rabbit-button", function () {
    const routeId = $(this).data("route-id");
    const route = getRouteById(routeId);

    $("#rabbitActionModalTitle").text(
      `[${route.httpMethod}] ${route.routePath}`
    );

    setRabbitActionData(route);

    $("#rabbitActionModal").modal("show");

    $("#saveRabbitAction")
      .off("click")
      .on("click", function () {
        const rabbitActionData = retrieveRabbitActionData();
        console.log(rabbitActionData);
        saveRabbitAction(routeId, rabbitActionData);
        $("#rabbitActionModal").modal("hide");
      });

    $("#deleteRabbitAction")
      .off("click")
      .on("click", function () {
        const rabbitActionData = retrieveRabbitActionData();
        console.log(rabbitActionData);
        deleteRabbitAction(routeId, rabbitActionData);
        $("#rabbitActionModal").modal("hide");
      });
  });

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

// $(document).ready(function () {
//   setTimeout(function () {
//     $("#rabbitActionModal").modal("show");
//   }, 500);
// });
