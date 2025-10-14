import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './Icons';

interface WelcomeScreenProps {
  onSuggestionClick: (prompt: string) => void;
  onSuggestionsGenerated: (suggestions: Suggestion[]) => void;
}

type Suggestion = {
    prompt: string;
    bgClass: string;
};

const simpleGradients = [
    "bg-gradient-to-br from-purple-500 to-indigo-600",
    "bg-gradient-to-br from-green-400 to-cyan-500",
    "bg-gradient-to-br from-rose-500 to-pink-600",
    "bg-gradient-to-br from-sky-400 to-blue-500",
    "bg-gradient-to-br from-amber-400 to-orange-500",
    "bg-gradient-to-br from-teal-400 to-emerald-500",
    "bg-gradient-to-br from-fuchsia-500 to-purple-600",
    "bg-gradient-to-br from-lime-400 to-green-500",
];

const allSuggestions: Suggestion[] = Array.from({ length: 200 }, (_, i) => {
    const prompts = [
        // Sci-Fi & Futuristic
        "一只戴着宇航员头盔的猫，数字艺术", "一座漂浮在云层之上的未来城市，黄昏时分", "一个机器人园丁正在照料发光的植物，赛博朋克风格",
        "一艘星际飞船穿过五彩斑斓的星云", "霓虹灯下的东京雨夜，充满未来感", "一个生化人侦探在反乌то邦城市中，电影感",
        "火星上的第一个人类殖民地，全景图", "一个由光构成的外星生物", "时间旅行者抵达维多利亚时代的伦敦",
        "一辆悬浮汽车在巨大的峡谷中比赛", "一个巨大的空间站环绕着一个系外行星", "一个人工智能的全息图正在与人类互动",
        // Fantasy & Magical
        "魔法森林中的发光蘑菇，细节丰富", "一条水晶龙栖息在山顶上", "一座隐藏在瀑布后面的精灵城市",
        "一位巫师正在他的天文台里研究星象", "被遗忘的亚特兰蒂斯水下王国", "一个勇敢的骑士面对着一只喷火的巨兽",
        "一个由书籍构成的巨大图书馆城堡", "一只凤凰从灰烬中重生", "一个地精在修补一个复杂的机械装置",
        "漂浮在天空中的岛屿，上面有古老的寺庙", "一个神秘的符文石在森林空地上发光", "一位女战士骑着一只巨大的狮鹫",
        // Nature & Animals
        "一只狐狸在雪地里，水彩画风格", "热带雨林深处的瀑布，阳光穿过树叶", "一群鲸鱼在星空下的海洋中遨游",
        "一只蜂鸟停留在奇异的花朵上，特写", "秋日森林中一条金色的小路", "一只熊猫在竹林里悠闲地吃着竹子",
        "壮观的北极光照亮冰川", "珊瑚礁里五彩斑斓的鱼群", "一只雄伟的老鹰在山脉上空翱翔",
        "樱花盛开的日本庭院", "宁静的湖面倒映着山脉和天空", "一只变色龙完美地伪装在树叶中",
        // Abstract & Surreal
        "一个由时钟和齿轮构成的超现实人脸", "几何形状构成的城市景观，立体主义", "一个漂浮在太空中的巨大茶壶",
        "思想的迷宫，抽象表现主义", "一个融化的棋盘，萨尔瓦多·达利风格", "一个由音符组成的旋涡",
        "城市在鲸鱼的背上", "一个玻璃苹果，里面有一个星系", "一个由液体彩虹构成的雕塑",
        "一个男人走在通往月亮的楼梯上",
        // Everyday life with a twist
        "一只穿着西装的狗在看报纸", "一个舒适的书店，书本漂浮在空中", "孩子们在月球上放风筝",
        "一家由机器人经营的咖啡馆", "一个巨大的草莓房子", "在云朵上野餐",
        "一个种着蔬菜的屋顶花园，俯瞰城市", "雨天里的一条舒适小巷，有温暖的灯光",
        // Art Styles
        "向日葵田，梵高风格", "一个赛博朋克武士，浮世绘风格", "一个宁静的湖，印象派风格",
        "一栋房子的肖像，像素艺术", "森林之灵，装饰艺术风格", "一个宇航员的肖像，波普艺术风格",
        "一幅描绘DNA双螺旋结构的壁画", "一幅城市的铅笔素描",
        // More creative prompts
        "蒸汽朋克风格的猫头鹰机械师", "一座由糖果建成的哥特式大教堂", "一个发光的生物水母在夜空中漂浮",
        "一棵古老的树，树根里有一个小村庄", "一个维京长船航行在宇宙星云中", "一个由废金属制成的巨大机器人雕塑",
        "沙漠中的水晶绿洲", "一位女爵士歌手在1920年代的地下酒吧演唱", "一个孩子第一次看到下雪的惊奇表情",
        "一个由玻璃制成的机械心脏", "一个古老的地图，上面有神秘的生物", "一个微型世界在一个玻璃瓶里",
        "一只折纸鸟在真正的森林里飞翔", "火山爆发，但喷出的是颜料而不是熔岩",
        "一个漂浮在太空中的图书馆", "一只狐狸在看一本关于鸡的书", "一个由意大利面条和肉丸组成的怪物",
        "一个城市，所有的建筑都是乐器", "一个巨大的橡皮鸭漂浮在海洋上", "一只猫在DJ台上打碟",
        "一个冰淇淋火山", "一个由云朵制成的城堡", "一个宇航员在土星环上冲浪", "一个机器人试图向人类解释爱",
        "一个隐藏在冰箱后面的秘密世界", "一棵结满星球的树", "一只章鱼在经营一个寿司吧", "一个由糖果制成的赛车",
        "一个侦探，他的搭档是一只鬼", "一个水下城市，居民是发光的鱼", "一个由书籍河流组成的图书馆",
        "一个会说话的蘑菇给迷路的孩子指路", "一个由回收材料制成的机器人管弦乐队", "一个在星系间旅行的太空马戏团",
        "一只戴着单片眼镜和礼帽的企鹅", "一个由废弃游乐园改造成的城市", "一个由水晶和宝石制成的森林",
        "一个可以让你进入别人梦境的装置", "一个由巧克力制成的河流和瀑布", "一个由蒸汽朋克昆虫组成的社会",
        "一个可以画出有生命的东西的魔法画笔", "一个由月光驱动的城市", "一个由巨大的蔬菜构成的景观",
        "一个由镜子构成的迷宫，反映出不同的现实", "一个由被遗忘的玩具组成的文明", "一个由纸牌建成的王国",
        "一个由低语的风守护的古老秘密", "一个可以把情绪变成颜色的机器", "一个由编织的星光制成的挂毯",
        "一个由冰雕成的城市，永不融化", "一个由各种味道的泡泡组成的海洋", "一个由漂浮的音符组成的交响乐",
        "一个由折纸动物居住的森林", "一个由记忆碎片构成的拼贴画", "一个由故事书页面铺成的小路",
        "一个由发光的苔藓照亮的水下洞穴", "一个由相互连接的树屋组成的村庄", "一个由巨大的花朵组成的花园",
        "一个由糖果手杖森林环绕的姜饼屋村庄", "一个由星尘和梦想制成的生物", "一个由废弃的霓虹灯标志组成的城市",
        "一个由巨大的贝壳构成的建筑", "一个由羽毛和云朵构成的景观", "一个由融化的时钟组成的沙漠",
        "一个由巨大的水晶簇构成的山脉", "一个由被遗忘的神祇的雕像组成的森林", "一个由巨大的棋盘格组成的景观",
        "一个由发光的符文组成的河流", "一个由巨大的书本构成的迷宫", "一个由巨大的乐器构成的城市",
        "一个由巨大的糖果组成的景观", "一个由巨大的玩具组成的城市", "一个由巨大的蔬菜组成的花园",
        "一个由巨大的水果组成的森林", "一个由巨大的花朵组成的景观", "一个由巨大的昆虫组成的城市",
        "一个由巨大的贝壳组成的花园", "一个由巨大的羽毛组成的森林", "一个由巨大的水晶组成的城市",
        "一个由巨大的宝石组成的景观", "一个由巨大的金属零件组成的城市", "一个由巨大的木制玩具组成的花园",
        "一个由巨大的塑料积木组成的森林", "一个由巨大的玻璃珠组成的城市", "一个由巨大的陶瓷碎片组成的景观",
        "一个由巨大的织物样本组成的城市", "一个由巨大的纸张剪影组成的花园", "一个由巨大的金属丝雕塑组成的森林",
        "一个由巨大的霓虹灯管组成的城市", "一个由巨大的LED屏幕组成的景观", "一个由巨大的电路板组成的城市",
        "一个由巨大的电线和电缆组成的花园", "一个由巨大的齿轮和链条组成的森林", "一个由巨大的管道和阀门组成的城市",
        "一个由巨大的弹簧和杠杆组成的景观", "一个由巨大的螺丝和螺母组成的城市", "一个由巨大的钉子和锤子组成的花园",
        "一个由巨大的锯子和斧头组成的森林", "一个由巨大的扳手和钳子组成的城市", "一个由巨大的螺丝刀和钻头组成的景观",
        "一个由巨大的针和线组成的城市", "一个由巨大的剪刀和刀片组成的花园", "一个由巨大的画笔和调色板组成的森林",
        "一个由巨大的铅笔和橡皮组成的城市", "一个由巨大的尺子和圆规组成的景观", "一个由巨大的书本和笔记本组成的城市",
        "一个由巨大的地图和地球仪组成的花园", "一个由巨大的望远镜和显微镜组成的森林", "一个由巨大的烧杯和试管组成的城市",
    ];
    return {
        prompt: prompts[i % prompts.length],
        bgClass: simpleGradients[i % simpleGradients.length],
    };
});


// Helper function to get random elements from an array
const getRandomSuggestions = (arr: Suggestion[], num: number): Suggestion[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
};


export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSuggestionClick, onSuggestionsGenerated }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    const randomSuggestions = getRandomSuggestions(allSuggestions, 3);
    setSuggestions(randomSuggestions);
    onSuggestionsGenerated(randomSuggestions);
  }, [onSuggestionsGenerated]);

  return (
    <div className="text-center w-full h-full flex flex-col items-center justify-center animate-fade-in px-4 pb-16">
      <SparklesIcon className="w-16 h-16 mx-auto text-[var(--color-accent)]" />
      <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">开始您的创作</h2>
      <p className="mt-2 text-[var(--color-text-secondary)] max-w-lg mx-auto">输入提示词生成图片，或点击左下角上传图片进行编辑。</p>
      
      <div className="mt-12 w-full max-w-4xl">
        <h3 className="text-[var(--color-text-primary)] font-semibold mb-4">或者，试试这些示例：</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion.prompt)}
              className={`relative aspect-[4/3] rounded-lg p-4 flex items-end text-left text-white overflow-hidden group transition-transform duration-300 ease-in-out hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] ${suggestion.bgClass}`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
              <p className="relative z-10 font-medium text-base">{suggestion.prompt}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};