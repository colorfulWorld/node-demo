import Vue from "vue";
import VueRouter from "vue-router";
import { UserLayout, BasicLayout } from "@/layouts";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: BasicLayout,
    redirect: "/task/list",
  },
  {
    path: "/user",
    component: UserLayout,
    redirect: "/user/login",
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("@/views/user/Login"),
      },
    ],
  },
  {
    path: "/task",
    redirect: "/task/list",
    component: BasicLayout,
    children: [
      {
        path: "list",
        name: "taskList",
        component: () => import("@/views/task/TaskList"),
      },
    ],
  },
  {
    path: "/404",
    component: () => import("@/views/404.vue"),
  },
  {
    path: "*",
    redirect: "/404",
  },
];

const router = new VueRouter({
  routes,
});

export default router;
