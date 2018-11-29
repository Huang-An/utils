import Listener from "./core/listener";

const listener = new Listener({
    data() {
        return {
            title: "测试",
            options: {
                label: "label",
                value: "value"
            }
        };
    },

    watch: {
        title(value, oldVal) {
            console.log(oldVal);
        }
    }
});

listener.title = "a";
