Vue.component("currency-input-view", {
    template: '\
                <input  class="inp_t"\
                    v-bind:value="formatValue"\
                    ref="input"\
                    v-on:input="updatevalue($event.target.value)"\
                    v-on:blur="onBlur"\
                    v-on:focus="selectAll" disabled autocomplete="off"/>\
        ',
    props: {
        value: {
            type: [String, Number],
            default: 0,
            desc: '数值'
        },
        symbol: {
            type: String,
            default: '',
            desc: '货币标识符'
        },
        decimal: {
            type: Number,
            default: 2,
            desc: '小数位'
        }
    },
    data:function() {
        return {
            focused: false,
        }
    },
    computed: {
        formatValue:function() {
            if (this.focused) {
                return accounting.unformat(this.value);
            } else {
                return accounting.formatMoney(this.value, this.symbol, this.decimal);
            }
        }
    },
    methods: {
        updatevalue:function(value) {
            var formatvalue = accounting.unformat(value);
            this.$emit("input", formatvalue)
        },
        onBlur:function() {
            this.focused = false;
            this.$emit("blur");
            this.dispatch("ElFormItem", "el.form.blur", [this.value]);
        },
        selectAll:function(event) {
            this.focused = true;
            setTimeout(function () {
                event.target.select()
            },0);
        },
        dispatch:function(componentName, eventName, params) {
            var parent = this.$parent || this.$root;
            var name = parent.$options.componentName;
            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;
                if (parent) {
                    name = parent.$options.componentName;
                }
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params));
            }
        }
    },
})
Vue.component("currency-input", {
    template: '\
                <div><input class="inp_t"\
                    v-bind:value="formatValue"\
                    ref="input" style="width: 80%;" \
                    v-on:input="updatevalue($event.target.value)"\
                    v-on:blur="onBlur"\
                    v-on:focus="selectAll" autocomplete="off"/>\
                    <span class="el-input__suffix"><span class="el-input__suffix-inner"><span>\
                    {{suffixStr}}</span></span></span></div>\
        ',
    props: {
        value: {
            type: [String, Number],
            default: 0,
            desc: '数值'
        },
        symbol: {
            type: String,
            default: '',
            desc: '货币标识符'
        },
        decimal: {
            type: Number,
            default: 2,
            desc: '小数位'
        },
        suffix: {
            type: String,
            default: '',
            desc: '后缀'
        }
    },
    data:function() {
        return {
            focused: false,
        }
    },
    computed: {
        formatValue:function() {
            if (this.focused) {
                return accounting.unformat(this.value);
            } else {
                return accounting.formatMoney(this.value, this.symbol, this.decimal);
            }
        },
        suffixStr:function () {
            return this.suffix;
        }
    },
    methods: {
        updatevalue:function(value) {
            var formatvalue = accounting.unformat(value);
            this.$emit("input", formatvalue)
        },
        onBlur:function() {
            this.focused = false;
            this.$emit("blur",this.value);
            // this.dispatch("ElFormItem", "el.form.blur", [this.value]);
        },
        selectAll:function(event) {
            this.focused = true;
            setTimeout(function () {
                event.target.select()
            },0);
        },
        dispatch:function(componentName, eventName, params) {
            var parent = this.$parent || this.$root;
            var name = parent.$options.componentName;
            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;
                if (parent) {
                    name = parent.$options.componentName;
                }
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params));
            }
        }
    },
})

Vue.component("currency-input-list", {
    template: '\
                <input class="el-input__inner"\
                    v-bind:value="formatValue"\
                    ref="input"\
                    v-on:input="updatevalue($event.target.value)"\
                    v-on:blur="onBlur"\
                    v-on:focus="selectAll"/>\
        ',
    props: {
        value: {
            type: [String, Number],
            default: 0,
            desc: '数值'
        },
        symbol: {
            type: String,
            default: '',
            desc: '货币标识符'
        },
        decimal: {
            type: Number,
            default: 2,
            desc: '小数位'
        }
    },
    data:function() {
        return {
            focused: false,
        }
    },
    computed: {
        formatValue:function() {
            if (this.focused) {
                return accounting.unformat(this.value);
            } else {
                return accounting.formatMoney(this.value, this.symbol, this.decimal);
            }
        }
    },
    methods: {
        updatevalue:function(value) {
            var formatvalue = accounting.unformat(value);
            this.$emit("input", formatvalue)
        },
        onBlur:function() {
            this.focused = false;
            this.$emit("blur");
            this.dispatch("ElFormItem", "el.form.blur", [this.value]);
        },
        selectAll:function(event) {
            this.focused = true;
            setTimeout(function () {
                event.target.select()
            },0);
        },
        dispatch:function(componentName, eventName, params) {
            var parent = this.$parent || this.$root;
            var name = parent.$options.componentName;
            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;
                if (parent) {
                    name = parent.$options.componentName;
                }
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params));
            }
        }
    },
})

Vue.component("currency-input2", {
    template: '\
                <input class="inp_t"\
                    v-bind:value="formatValue"\
                    ref="input" style="width: 80%;" \
                    v-on:input="updatevalue($event.target.value)"\
                    v-on:blur="onBlur"\
                    v-on:focus="selectAll" autocomplete="off"/>\
        ',
    props: {
        value: {
            type: [String, Number],
            default: 0,
            desc: '数值'
        },
        symbol: {
            type: String,
            default: '',
            desc: '货币标识符'
        },
        decimal: {
            type: Number,
            default: 2,
            desc: '小数位'
        },
        suffix: {
            type: String,
            default: '',
            desc: '后缀'
        }
    },
    data:function() {
        return {
            focused: false,
        }
    },
    computed: {
        formatValue:function() {
            if (this.focused) {
                return accounting.unformat(this.value);
            } else {
                return accounting.formatMoney(this.value, this.symbol, this.decimal);
            }
        },
        suffixStr:function () {
            return this.suffix;
        }
    },
    methods: {
        updatevalue:function(value) {
            var formatvalue = accounting.unformat(value);
            this.$emit("input", formatvalue)
        },
        onBlur:function() {
            this.focused = false;
            this.$emit("blur",this.value);
            // this.dispatch("ElFormItem", "el.form.blur", [this.value]);
        },
        selectAll:function(event) {
            this.focused = true;
            setTimeout(function () {
                event.target.select()
            },0);
        },
        dispatch:function(componentName, eventName, params) {
            var parent = this.$parent || this.$root;
            var name = parent.$options.componentName;
            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;
                if (parent) {
                    name = parent.$options.componentName;
                }
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params));
            }
        }
    },
})