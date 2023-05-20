const fetchRoutes = () => {
  $.ajax({
    url: "/prefix",
    type: "GET",
    success: (prefixResponse) => {
      const prefix = prefixResponse.prefix;
      $.ajax({
        url: "/route",
        type: "GET",
        success: (routes) => {
          renderRoutesTable(routes, prefix);
        },
        error: () => {
          console.error("Error fetching routes.");
        },
      });
    },
    error: () => {
      console.error("Error fetching prefix.");
    },
  });
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
