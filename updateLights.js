var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var HOUR_TURN_ON = 8;
var HOUR_TURN_OFF = 22;
var sendJSONToLights = function (payload) {
    return fetch("http://192.168.86.36/json/state", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: payload
    });
};
var updateWaterTankLights = function () { return __awaiter(_this, void 0, void 0, function () {
    var currentWaterLevel, numberLedsLit, payload, wledUpdateResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("https://npbshnwpzucklggglbnw.supabase.co/functions/v1/get-water-level", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }).then(function (networkResponse) {
                    return networkResponse.json().then(function (jsonResponse) {
                        return jsonResponse.percent_full;
                    });
                })];
            case 1:
                currentWaterLevel = _a.sent();
                numberLedsLit = Math.floor((260 / 100) * currentWaterLevel) + 12 // extra to account for LEDs no going to the very top of tank
                ;
                console.log("Water Level is ".concat(currentWaterLevel, ", leds lit:").concat(numberLedsLit));
                payload = "{\"seg\":{\"i\":[0,".concat(numberLedsLit, ",\"0000FF\",").concat(numberLedsLit, ",").concat(numberLedsLit, ",\"FF0000\",").concat(numberLedsLit + 1, ",260,\"00FF00\"]}}");
                console.log(payload);
                if (!(currentWaterLevel > 0 && currentWaterLevel <= 100)) return [3 /*break*/, 3];
                return [4 /*yield*/, sendJSONToLights(payload)];
            case 2:
                wledUpdateResponse = _a.sent();
                wledUpdateResponse.json().then(function (res) {
                    console.log(JSON.stringify(res));
                });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
var isTankLightOn = function () {
    var currentHour = new Date().getHours();
    var isLightOn = currentHour >= HOUR_TURN_ON && currentHour < HOUR_TURN_OFF;
    console.log("Current hour is ".concat(currentHour, ", light should be ").concat(isLightOn ? "on" : "off"));
    return isLightOn;
};
var setTankLightStatus = function (isOn) { return __awaiter(_this, void 0, void 0, function () {
    var payload, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = {
                    on: isOn,
                    bri: 150
                };
                return [4 /*yield*/, sendJSONToLights(JSON.stringify(payload))];
            case 1:
                response = _a.sent();
                response.json().then(function (json) {
                    console.log("Set light status response ".concat(JSON.stringify(json)));
                });
                return [2 /*return*/];
        }
    });
}); };
setTankLightStatus(isTankLightOn()).then(function () { return updateWaterTankLights(); });
