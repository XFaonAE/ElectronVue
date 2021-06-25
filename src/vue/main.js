import Vue from "vue";
import Main from "./Main.vue";

// Start the VueJS renderer
new Vue({
    el: "#app",
    render: h => h(Main),
});