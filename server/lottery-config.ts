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
}