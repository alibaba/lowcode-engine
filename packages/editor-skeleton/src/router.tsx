import React from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import path from 'path';
import routes from '@/config/routes';

const RouteItem = (props) => {
  const { redirect, path: routePath, component, key } = props;
  if (redirect) {
    return (
      <Redirect
        exact
        key={key}
        from={routePath}
        to={redirect}
      />
    );
  }
  return (
    <Route
      key={key}
      component={component}
      path={routePath}
    />
  );
};

const router = () => {
  return (
    <Router>
      <Switch>
        {routes.map((route, id) => {
          const { component: RouteComponent, children, ...others } = route;
          return (
            <Route
              key={id}
              {...others}
              component={(props) => {
                return (
                  children ? (
                    <RouteComponent key={id} {...props}>
                      <Switch>
                        {children.map((routeChild, idx) => {
                          const { redirect, path: childPath, component } = routeChild;
                          return RouteItem({
                            key: `${id}-${idx}`,
                            redirect,
                            path: childPath && path.join(route.path, childPath),
                            component,
                          });
                        })}
                      </Switch>
                    </RouteComponent>
                  ) : (
                    <>
                      {
                        RouteItem({
                          key: id,
                          ...route,
                        })
                      }
                    </>
                  )
                );
              }}
            />
          );
        })}
      </Switch>
    </Router>
  );
};

export default router;
