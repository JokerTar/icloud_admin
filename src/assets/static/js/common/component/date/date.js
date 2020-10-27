Vue.component("vue-date",{
    data:function(){
        return {
            date:this.value,
            format:this.fmt
        };
    },
    props:['value','fmt','mindate','maxdate','picking','banDates','banDays'],
    template:"\
            <input type=\"text\" :value=\"value\" @blur=\"emitDate()\" class=\"form-control Wdate\" @focus=\"selectDate\" style=\"background-color: white;\" />\
    ",
    watch:{
        fmt:function(){
            this.format = this.fmt;
        },
        value:function(val){
            if(this.date!=val){
                this.$emit('change', val);
            }
            this.date = val;

        },
        date:function(val){
            this.emitDate(val);
        }
    },
    methods:{
        emitDate:function(val){
            var self = this;
            if(val==null){
                val = $(self.$el).val();
            }
            self.$emit('input', val);
        },
        selectDate:function(){
            var self = this;
            if(self.fmt==null){
                self.format='yyyy-MM-dd';
            }
            WdatePicker(
                {
                    lang:'zh-cn',
                    dateFmt:self.format,
                    disabledDays:self.banDays,
                    disabledDates:self.banDates,
                    minDate:self.mindate,
                    maxDate:self.maxdate,
                    onpicking:self.picking,
                    onpicked:function(dp){
                        var oldDate = self.date;
                        self.date =dp.cal.getNewDateStr();
                        if(self.date!=oldDate){
                            self.$emit('change', self.date);
                        }
                    }
                }
                );
        }
    }
})