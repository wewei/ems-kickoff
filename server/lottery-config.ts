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
}