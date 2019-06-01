module.exports = {
    success: function(data) {
        return { st: 0, msg: "SUCCESS", body: data };
    },
    relogin: function(data) {
        return { st: -2, msg: "您还未登录" };
    },
    fail: function(msg) {
        // 显示错误信息 modal.error
        return { st: -1, msg: msg };
    },
    info: function(msg) {
        // 显示提示信息 modal.info
        return { st: -12, msg: msg };
    },
    msg: function(msg) {
        // 显示提示信息 message.info
        return { st: -3, msg: msg };
    },
    confirm: function(msg) {
        // 需要用户确认
        return { st: 200000, msg };
    }
};
