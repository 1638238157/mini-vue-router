let _vue;

class HistoryRoute {
    constructor() {
        this.current = null;
    }
}
export default class VueRouter {
    constructor(options) {
        this.mode = options.mode || 'hash';
        this.routes = options.routes || [];
        this.routesMap = this.createMap(this.routes);
        this.history = new HistoryRoute();
        this.init();
    }
    init() {
        if (this.mode === 'hash') {
            // 先判断用户打开时有没有hash值，没有的话跳转到 #/
            location.hash ? '' : location.hash = "/";
            window.addEventListener("load", () => {
                this.history.current = location.hash.slice(1);
            });
            window.addEventListener("hashchange", () => {
                this.history.current = location.hash.slice(1);
            });
        } else {
            location.pathname ? '' : location.pathname = '/';
            window.addEventListener('load', () => {
                this.history.current = location.pathname;
            });
            window.addEventListener('popstate', () => {
                this.history.current = location.pathname;
            });
        }
    }
    createMap(routes) {
        return routes.reduce((pre, current) => {
            pre[current.path] = current.component;
            return pre;
        }, {})
    }
}

VueRouter.install = function (Vue) {
    _vue = Vue;
    _vue.mixin({
        beforeCreate() {
            if (this.$options && this.$options.router) { // 根组件
                this._root = this;
                this._router = this.$options.router;
                Vue.util.defineReactive(this, "xxx", this._router.history);
            } else { // 子组件
                this._root = this.$parent && this.$parent._root;
            }
            Object.defineProperty(this, '$router', {
                get() {
                    return this._root._router
                }
            })
            Object.defineProperty(this, '$route', {
                get() {
                    return this._root._router.history.current
                }
            })
        }
    });
    Vue.component('router-view', {
        render(h) {
            const current = this._self._root._router.history.current;
            const routeMap = this._self._root._router.routesMap;
            return h(routeMap[current])
        }
    });
    Vue.component('router-link', {
        props: {
            to: String
        },
        render(h) {
            let mode = this._self._root._router.mode;
            let to = mode === "hash" ? "#" + this.to : this.to
            return h('a', { attrs: { href: to }, on: { click: this.jumpToPage } }, this.$slots.default)
        },
        methods: {
            jumpToPage(e) {
                let mode = this._self._root._router.mode;
                if(mode === "hash"){
                    return;
                }
                // 1、阻止a标签的默认跳转行为，因为会刷新浏览器
                e.preventDefault();
                // 2、手动通过pushState方法实现：只修改浏览器的地址栏，且记录浏览器历史，且不向服务器发送请求
                /* pushState参数说明：
                              参数一：对象，传给popState事件的对象，暂时无用
                              参数二：网页的标题title，暂时无用
                              参数三：需要跳转到的path路径 */
                history.pushState({}, "", this.to);
                // 3、手动改变地址栏后，实现对应组件的渲染，即通过改变this.$router.history.current的值实现组件的响应式重新渲染
                this.$router.history.current = this.to;
            }
        }
    });
}