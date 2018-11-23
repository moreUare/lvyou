/**
 * Created by billy on 09/27/2017.
 */

var login_status = {
    "not_login":0,
    'login' : 1,
};

var pushType = {
    "undefined" : 0,
    "opened" : 1,
    "closed" : 2,
};

var pushSubType = {
    "over_power" : -1,
    "over_time" : -2,
    "undefined" : 0,
    "closed" : 1,
    "charged" : 2
};

var orderStatus = {
    "cmd_send_error" : -1,
    "expire" : -2,
    "closed" : -3,
    "lost" : -4,
    "return expire" : -5,
    "wait_box_response" : 1,
    "in_use" : 2,
    "complete" : 3
};

var rechargeType = {
    "app" : 1,
    "entityCard" : 2
};

module.exports = {
    login_status : login_status,
    pushType : pushType,
    pushSubType : pushSubType,
    orderStatus : orderStatus,
    rechargeType : rechargeType
}