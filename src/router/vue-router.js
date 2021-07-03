export default class VueRouter{
    constructor({routes}){
        this.routes = routes;
        console.log(this.routes);
    }
}

VueRouter.install = function (Vue){
    Vue.component('router-view',{
        render(){
            
        }
    })
}