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
                    text: "特别奖",
                    title: "神秘",
                    img: '/lottery/assets/qizhang.png',
                }, {
                    type: 1,
                    count: 1,
                    text: "一等奖",
                    title: "Qi's lunch",
                    img: '/lottery/assets/qizhang.png',
                }, {
                    type: 2,
                    count: 2,
                    text: "二等奖",
                    title: "Jingxia's 红包 888",
                    img: '/lottery/assets/redpacket-888.png',
                }, {
                    type: 3,
                    count: 5,
                    text: "三等奖",
                    title: "EMS LT's 红包 666",
                    img: '/lottery/assets/redpacket-666.png',
                }],
            EACH_COUNT: [1, 1, 2, 5],
            COMPANY: "Microsoft",
        };
    });
}
exports.getLotteryConfig = getLotteryConfig;
