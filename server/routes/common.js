var express = require("express");
var router = express.Router();
var resTemplate = require("../data/response");
var commonData = require("../data/common");

// 排他规则数据
router.all("/select", function(req, res, next) {
    let recordData = {
        records: commonData.select
    };
    res.send(resTemplate.success(recordData));
});

module.exports = router;
