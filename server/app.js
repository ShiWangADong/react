var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var routerConfig = require("./config");
var respTemp = require("./data/response");
var routerData = {};

// 递归获取路由配置
(function getRouterData(parentRouter, parentPath) {
    // 表示数组
    parentRouter.map(item => {
        if (typeof item === "string") {
            var tempCurrentRouter = parentPath + "/" + item;
            routerData[tempCurrentRouter] = require("./routes/" + tempCurrentRouter);
        } else {
            // 表示数组
            Object.keys(parentRouter).map(itemID => {
                getRouterData(parentRouter[itemID], parentPath + "/" + itemID);
            });
        }
    });
})(routerConfig, "");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/o2m-base", express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

app.use(
    cors({
        origin: function(origin, callback) {
            callback(null, true);
        },
        credentials: true
    })
);

Object.keys(routerData).map(routerID => {
    app.use(routerID, routerData[routerID]);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    //next(createError(404));
    res.send(respTemp.fail("请求的地址[" + req.originalUrl + "]不存在！"));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
