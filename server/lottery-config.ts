export type Prize = {
    type: number,
    count: number,  // Total number of the prize
    text: string,   // Name of the prize
    title: string,  // Description of the prize
    img: string,    // Url to the image of the prize
};

export type LotteryConfig = {
    prizes: Prize[],
    EACH_COUNT: number[], // Count for each round
    COMPANY: string,      // Company name
};

export async function getLotteryConfig(): Promise<LotteryConfig> {
    return {
        prizes: [{
            type: 0,
            count: 1000,
            text: "特等奖",
            title: "iPhone (待定)",
            img: '/lottery/assets/qizhang.png',
        }, {
            type: 1,
            count: 1,
            text: "一等奖",
            title: "耳机 (型号待定)",
            img: '/lottery/assets/qizhang.png',
        }, {
            type: 2,
            count: 2,
            text: "二等奖",
            title: "重力星球鼠标10个",
            img: '/lottery/assets/redpacket-888.png',

        }, {
            type: 3,
            count: 5,
            text: "三等奖",
            title: "趣味印字T恤50件",
            img: '/lottery/assets/redpacket-666.png',
        }],
        EACH_COUNT: [1, 5, 10, 50],
        COMPANY: "Microsoft",
    };
}