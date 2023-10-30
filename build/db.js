"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const level_1 = require("level");
const db = new level_1.Level('data/lottery-register-index', { valueEncoding: 'json' });
function register(userId, deviceId, appId) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield (db.get(deviceId)).catch(() => ({}));
        const oldUserId = data[appId] || '';
        data[appId] = userId;
        yield db.put(deviceId, data);
        return Promise.resolve(oldUserId);
    });
}
exports.register = register;
