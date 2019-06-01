var express = require("express");
var app = express();
require("express-ws")(app);

var data = {
    title: "测试和数据",
    label: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    series: [
        {
            name: "直接访问",
            data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
            name: "邮件营销",
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: "联盟广告",
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: "视频广告",
            data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
            name: "其他",
            data: [62, 82, 91, 84, 109, 110, 120]
        }
    ]
};

app.ws("/ws", function(ws, req) {
    setInterval(function () {
        data.series.forEach(function (item) {
            var seriesData=[];
            var count=7;
            while(count>0){
                seriesData.push(parseInt(Math.random()*350+50));
                count--;
            }
            item.data=seriesData;
        });
        ws.send(JSON.stringify(data));
    }, 2000);
});

app.ws("/makecard1", function(ws, req) {
    ws.on("message", function(msg) {
        ws.send(JSON.stringify({ id: msg ||'' }));
    });
});

app.listen(3200);
