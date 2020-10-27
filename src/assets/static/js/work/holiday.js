Vue.component("calendar", {
    template: "#calendar",
    data: function () {
        return {
            currentDay: 1,
            currentMonth: 1,
            currentYear: 1970,
            currentWeek: 1,
            days: [],
            date:{}
        }
    },
    props:{
        daylist:{
            type:Array
        },
    },

    created:function () {
        var that = this;
        that.initData(null);
        that.selectDate(new Date());
    },
    computed: {

        formate:function () {
            var self = this;
            var flag = self.daylist != undefined && self.daylist.length > 0;
            if (flag) {
                for (var i = 0; i <self.daylist.length; i++) {
                    var date = self.msToDate(new Date(self.daylist[i].executionTime)).withoutTime;
                    for (var j = 0;j< self.days.length;j++) {
                        var day = self.msToDate(self.days[j].day).withoutTime;
                        if (day == date) {
                            Vue.set(self.days[j], "dayMatter", true);
                        }
                        // else{
                        //     Vue.set(self.days[j], "dayMatter", false);
                        // }
                    }
                }
            }
        }
    },
    methods: {

        selectDate:function (date) {
            Vue.set(this,'date',date);
            this.$emit("listentochildevent",date);
        },

        initData: function (cur) {
            var that = this;
            var leftcount = 0; //存放剩余数量
            var date;
            if (cur) {
                date = new Date(cur);
            } else {
                var now = new Date();
                var d = new Date(that.formatDate(now.getFullYear(), now.getMonth(), 1));
                d.setDate(35);
                date = new Date(that.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
            }
            that.currentDay = date.getDate();
            that.currentYear = date.getFullYear();
            that.currentMonth = date.getMonth() + 1;
            that.currentWeek = date.getDay(); // 1...6,0
            if (that.currentWeek == 0) {
                that.currentWeek = 7;
            }
            var str = that.formatDate(that.currentYear, that.currentMonth, that.currentDay);
            that.days.length = 0;
            // 今天是周日，放在第一行第7个位置，前面6个
            //初始化本周
            for (var i = that.currentWeek - 1; i >= 0; i--) {
                var d = new Date(str);
                d.setDate(d.getDate() - i);
                var dayobject = {}; //用一个对象包装Date对象  以便为以后预定功能添加属性
                dayobject.day = d;
                that.days.push(dayobject); //将日期放入data 中的days数组 供页面渲染使用
            }
            //其他周
            for (var i = 1; i <= 35 - that.currentWeek; i++) {
                var d = new Date(str);
                d.setDate(d.getDate() + i);
                var dayobject = {};
                dayobject.day = d;
                that.days.push(dayobject);
            }

        },
        pickPre: function (year, month) {
            var that = this;
            // setDate(0); 上月最后一天
            // setDate(-1); 上月倒数第二天
            // setDate(dx) 参数dx为 上月最后一天的前后dx天
            var d = new Date(that.formatDate(year, month, 1));
            d.setDate(0);
            that.initData(that.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
        },
        pickNext: function (year, month) {
            var that = this;
            var d = new Date(that.formatDate(year, month, 1));
            d.setDate(35);
            that.initData(that.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
        },
        pickYear: function (year, month) {
            // alert(year + "," + month);
        },
        // 返回 类似 2016-01-02 格式的字符串
        formatDate: function (year, month, day) {
            var y = year;
            var m = month;
            if (m < 10) m = "0" + m;
            var d = day;
            if (d < 10) d = "0" + d;
            return y + "-" + m + "-" + d
        },
        msToDate:function(msec){
            var datetime = new Date(msec);
            var year = datetime.getFullYear();
            var month = datetime.getMonth();
            var date = datetime.getDate();
            var hour = datetime.getHours();
            var minute = datetime.getMinutes();
            var second = datetime.getSeconds();

            var result1 = year +
                '-' +
                ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +
                '-' +
                ((date + 1) < 10 ? '0' + date : date) +
                ' ' +
                ((hour + 1) < 10 ? '0' + hour : hour) +
                ':' +
                ((minute + 1) < 10 ? '0' + minute : minute) +
                ':' +
                ((second + 1) < 10 ? '0' + second : second);

            var result2 = year +
                '-' +
                ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +
                '-' +
                ((date + 1) < 10 ? '0' + date : date);

            var result = {
                hasTime: result1,
                withoutTime: result2
            };

            return result;
        }
    }
})
