export type LANG = {
    top: string;
    hot: string;
    slogan: string;
    search: string;
    ask: string;
}

// 多语配置
export const LANG: {
    [key in 'zh' | 'en' | 'ja']: LANG;
} = {
    zh: {
        top: '排行榜',
        hot: '热点',
        slogan: 'AI爱好者必备的AI工具箱',
        search: '站内搜索',
        ask: '问问AI',
    },
    en: {
        top: 'Ranking',
        hot: 'Hot',
        slogan: 'Essential AI Toolbox for AI Enthusiasts',
        search: 'Search',
        ask: 'Ask AI',
    },
    ja: {
        top: 'ランキング',
        hot: 'ホット',
        slogan: 'AI愛好家のための必須AIツールボックス',
        search: 'サイト内検索',
        ask: 'AIに聞く',
    },
}