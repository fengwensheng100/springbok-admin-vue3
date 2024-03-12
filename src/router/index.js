import { createRouter, createWebHistory } from "vue-router";
// 静态路由配置
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import { listSysMenuByUser } from "@/api/user";
import { useStore } from "@/store";

let store = null;

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
    children: [],
  },
  {
    path: "/",
    name: "Login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const modules = import.meta.glob("../views/**/**.vue");

const whiteList = ["/"];

function initStore() {
  if (store == null) {
    store = useStore();
  }
}

function diguiAddRoute(menuList) {
  menuList.forEach((menu) => {
    if (menu.childrenList) {
      diguiAddRoute(menu.childrenList);
    } else {
      if (menu.routerPath != null && menu.routerPath != "") {
        const component = modules[".." + menu.routerComponent];
        if (component) {
          const dynamicRoute = {
            name: menu.routerName,
            path: menu.routerPath,
            component: component
          };
          router.addRoute("Home", dynamicRoute);
          store.routerList.push(dynamicRoute);
        }
      }
    }
  });
}

router.beforeEach(async (to, from, next) => {
  initStore();
  if (!whiteList.includes(to.path)) {
    if (!store.userInfo.token) {
      next("/");
    } else {
      // 菜单列表为空时，请求数据加载菜单
      if (store.menuList.length == 0) {
        await listSysMenuByUser()
          .then((res) => {
            store.menuList = res.data;
            diguiAddRoute(store.menuList);
            next({ ...to, replace: true });
          })
          .catch((err) => {
            console.log(err);
          });
      }
      next();
    }
  } else {
    next();
  }
});


export default router;