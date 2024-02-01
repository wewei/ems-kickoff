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
            text: "抽奖结束",
            title: "抽奖结束",
            img: '/lottery/assets/0.png',
        },{
            type: 1,
            count: 1,
            text: "特等奖",
            title: "Airpods Pro Max",
            img: '/lottery/assets/0.png',
        }, {
            type: 2,
            count: 5,
            text: "一等奖",
            title: "Airpods Pro 2",
            img: '/lottery/assets/1.png',
        }, {
            type: 3,
            count: 10,
            text: "二等奖",
            title: "重力星球鼠标",
            img: '/lottery/assets/2.png',

        }, {
            type: 4,
            count: 50,
            text: "三等奖",
            title: "趣味印字T恤",
            img: '/lottery/assets/3.png',
        }],
        EACH_COUNT: [1000, 1, 5, 10, 10],
        COMPANY: "Microsoft",
    };
}