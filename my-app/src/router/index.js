import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../pages/layout";
import Home from "../pages/home";
// import Mail from '../pages/mail'
import User from "../pages/user";
import Login from "../pages/login";
// 暂时先注释掉
// import pageOne from '../pages/other/pageOne'
// import pageTwo from '../pages/other/pageTwo'

const routes = [
  {
    path: "/",
    Component: Layout,
    children: [
      //重定向
      {
        path: "/",
        element: <Navigate to="home" replace />,
      },
      {
        path: "home",
        Component: Home,
      },
      // {
      //   path: 'mail',
      //   Component: Mail
      // },
      {
        path: "user",
        Component: User,
      },
      // {
      //   path: 'other',
      //   children: [
      //     {
      //       path: 'pageOne',
      //       Component: pageOne
      //     },
      //     {
      //       path: 'pageTwo',
      //       Component: pageTwo
      //     }
      //   ]
      // }
    ],
  },
  {
    path: "login",
    Component: Login,
  },
];

export default createBrowserRouter(routes);
