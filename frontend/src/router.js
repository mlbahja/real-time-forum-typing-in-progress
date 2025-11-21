export function Router(routesObj, routeView) {
  const routes = {};

  for (let [routeName, component] of Object.entries(routesObj)) {
    routes[routeName] = component;
  }

  // modified navigate(to) => navigate(path)
  function navigate(path) {
    const page = routes[path];
    if (page) {
      routeView.innerHTML = "";
      history.pushState({}, null, path);
      routeView.append(page());
    }
  }

  function redirect(to, delay = 0) {
    console.log("refirect to", to);
    setTimeout(() => {
      navigate(to);
    }, delay);
  }

  return { navigate, redirect };
}
