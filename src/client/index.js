import Vue from 'vue/dist/vue.js'
import App from './App.vue'
// import Test from './components/Test.vue';
import store from './store';
import router from './router';

const test = async() => {
    await new Promise((resolve, reject) => {
        reject('报错');
        // reject(new Error('报错'));
        throw new Error('报错');
    })
    console.log('下面执行的内容')
}

test();


window.addEventListener('unhandledrejection', function (event) {
    event.preventDefault();
    console.log(event, 'event');
})

// new Vue({
//     store,
//     el: '#app',
//     // template: '<App />',
//     // components: { App, 'test': Test },
// });

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app')
