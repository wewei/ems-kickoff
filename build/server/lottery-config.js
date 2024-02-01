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
exports.getLotteryConfig = void 0;
function getLotteryConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            prizes: [{
                    type: 0,
                    count: 1000,
                    text: "特等奖",
                    title: "Airpods Pro Max",
                    img: '/lottery/assets/0.png',
                }, {
                    type: 1,
                    count: 1,
                    text: "一等奖",
                    title: "Airpods Generation 3",
                    img: '/lottery/assets/1.png',
                }, {
                    type: 2,
                    count: 2,
                    text: "二等奖",
                    title: "重力星球鼠标",
                    img: '/lottery/assets/2.png',
                }, {
                    type: 3,
                    count: 5,
                    text: "三等奖",
                    title: "趣味印字T恤",
                    img: '/lottery/assets/3.png',
                }],
            EACH_COUNT: [1, 5, 10, 50],
            COMPANY: "Microsoft",
        };
    });
}
exports.getLotteryConfig = getLotteryConfig;