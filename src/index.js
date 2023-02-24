import Vue from "vue/dist/vue.js";
import App from "./App.vue";
// import Test from './components/Test.vue';
import store from "./store";
import router from "./router";
import './public-path'; 

const test = async () => {
  await new Promise((resolve, reject) => {
    reject("报错");
    // reject(new Error('报错'));
    throw new Error("报错");
  });
  console.log("下面执行的内容");
};

test();

window.addEventListener("unhandledrejection", function (event) {
  event.preventDefault();
  console.log(event, "event");
});

debugger;
// new Vue({
//     store,
//     el: '#app',
//     // template: '<App />',
//     // components: { App, 'test': Test },
// });

window.xxx = 2;

let instance = null;
function render(props = {}) {
  const { container } = props;
  instance = new Vue({
    store,
    router,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector("#app") : "#app");
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log("[vue] vue app bootstraped");
}
export async function mount(props) {
  console.log(window, 'window');
  console.log(window.xxx, 'window');
  console.log("[vue] props from main framework", props);
  render(props);
}
export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = "";
  instance = null;
//   router = null;
}
