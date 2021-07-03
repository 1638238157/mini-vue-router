let _vue;

class HistoryRoute{
    constructor(){
        this.current = null;
    }
}
export default class VueRouter{
    constructor(options){
        this.mode = options || 'hash';
        this.routes = options.routes || [];
        this.routesMap = this.createMap(this.routes);
        this.history = new HistoryRoute();
        this.init();
    }
    init(){
        if(this.mode === 'hash'){
            // 先判断用户打开时有没有hash值，没有的话跳转到 #/
            location.hash ? '' : location.hash = "/";
            window.addEventListener("load",() => {
                this.history.current = location.hash.slice(1);
            });
            window.addEventListener("hashchange",() => {
                this.history.current = location.hash.slice(1);
            });
        } else {
            location.pathname ? '' : location.pathname = '/';
            window.addEventListener('load',() => {
                this.history.current = location.pathname;
            });
            window.addEventListener('popstate', () => {
                this.history.current = location.pathname;
            });
        }
    }
    createMap(routes){
        return routes.reduce((pre,current) => {
            pre[current.path] = current.component;
            return pre;
        },{})
    }
}

VueRouter.install = function (Vue){
    _vue = Vue;
    _vue.mixin({
        beforeCreate(){
            if(this.$options && this.$options.router){ // 根组件
                this._root = this;
                this._router = this.$options.router;
            }else { // 子组件
                this._root = this.$parent && this.$parent._root;
            }
            Object.defineProperty(this,'$router',{
                get(){
                    return this._root._router
                }
            })
        }
    });
    Vue.component('router-view',{
        render(h){
            return h('h1',{},'首页视图')
        }
    });
    Vue.component('router-link',{
        render(h){
            return h('a',{},'首页')
        }
    });
}