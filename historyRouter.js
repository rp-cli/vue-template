class Routers {
  constructor() {
    this.routes = {};
    this._bindPopState();
  }
  init(path) {
    history.replaceState({path: path}, null, path);
    this.routes[path] && this.routes[path]();
  }

  route(path, callback) {
    this.routes[path] = callback || function() {};
  }

  go(path) {
    history.pushState({path: path}, null, path);
    this.routes[path] && this.routes[path](); 
  }
  _bindPopState() {
    window.addEventListener('popstate', e => {
      console.log('popstate');
      const path = e.state && e.state.path;
      this.routes[path] && this.routes[path]();

    });
  }
  backOff(){
    history.back();
  }
} 

window.Router = new Routers();
Router.init(location.pathname);
const content = document.querySelector('body');
const ul = document.querySelector('ul');
const button = document.querySelector('button');
function changeBgColor(color) {
  content.style.backgroundColor = color;
  console.log(window.history, 'window.history');
}

Router.route('/', function() {
  changeBgColor('yellow');
});
Router.route('/blue', function() {
  changeBgColor('blue');
});
Router.route('/green', function() {
  changeBgColor('green');
});

ul.addEventListener('click', e => {
  console.log(1);
  console.log(e.target.tagName, 'e.target.tagName');
  if (e.target.tagName === 'A') {
    e.preventDefault();
    Router.go(e.target.getAttribute('href'));
  }
});

button.addEventListener('click', Router.backOff, false);
