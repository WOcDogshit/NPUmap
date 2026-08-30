// ============================================
// 西北工业大学 · 双校区校园地点数据
// 坐标系：GCJ-02（腾讯地图 / 微信小程序地图通用）
// 校区：长安校区（新校区）+ 友谊校区（老校区）
// 坐标来源：长安校区来自腾讯位置服务坐标拾取（2026-08-29）；
//           友谊校区中心/西门/南门来自高德地图（GCJ-02），
//           其余为基于公开资料的估算位置，待用腾讯 API 精确校准
// 建议：开学后在校园里实测核对一遍，有偏差再微调
// ============================================

module.exports = {
  campuses: [
    {
      id: 'changan',
      name: '西北工业大学长安校区',
      shortName: '长安校区',
      center: { latitude: 34.0305, longitude: 108.7656 }
    },
    {
      id: 'youyi',
      name: '西北工业大学友谊校区',
      shortName: '友谊校区',
      center: { latitude: 34.243675, longitude: 108.915417 }
    }
  ],

  pois: [
    {
      id: 'p01', campus: 'changan', name: '正门（东大门）', type: '校门', icon: '🚪',
      latitude: 34.033974, longitude: 108.769899,
      address: '西安市长安区东祥路1号', description: '长安校区主校门，位于东祥路，报到和访客一般从这里进出',
      tags: ["校门","东门","报到"], color: 'red'
    },
    {
      id: 'p02', campus: 'changan', name: '图书馆', type: '学习', icon: '📚',
      latitude: 34.030858, longitude: 108.765654,
      address: '东祥路1号西北工业大学长安校区', description: '建在启真湖上的“水上图书馆”，需要刷校园卡进入',
      tags: ["学习","自习","借书"], color: 'blue'
    },
    {
      id: 'p03', campus: 'changan', name: '教学西楼', type: '教学楼', icon: '🏫',
      latitude: 34.031875, longitude: 108.763927,
      address: '校区教学区西侧', description: 'A/B/C/D 座，公共基础课大多在这里上，D座是大教室',
      tags: ["教学楼","上课","公共课","自习"], color: 'blue'
    },
    {
      id: 'p04', campus: 'changan', name: '教学东楼', type: '教学楼', icon: '🏫',
      latitude: 34.033199, longitude: 108.766887,
      address: '校区教学区东侧', description: '教学楼，很多课程在这里上',
      tags: ["教学楼","上课"], color: 'blue'
    },
    {
      id: 'p05', campus: 'changan', name: '数字化大楼', type: '教学楼', icon: '🏛️',
      latitude: 34.033679, longitude: 108.763077,
      address: '校区教学区', description: '信息化教学与办公，机房所在地',
      tags: ["教学楼","机房","办公"], color: 'blue'
    },
    {
      id: 'p06', campus: 'changan', name: '翱翔学生中心', type: '活动', icon: '🎭',
      latitude: 34.035192, longitude: 108.765645,
      address: '东祥路1号银河路附近', description: '学生活动中心，约1100个座位，大型演出、学术报告常在这里办',
      tags: ["活动","演出","报告","晚会"], color: 'purple'
    },
    {
      id: 'p07', campus: 'changan', name: '翱翔体育馆', type: '运动', icon: '🏀',
      latitude: 34.03493, longitude: 108.768951,
      address: '校区内', description: '由比赛馆和训练馆组成，看台约6000座，体育课和大型活动场地',
      tags: ["运动","体育馆","篮球","比赛"], color: 'purple'
    },
    {
      id: 'p08', campus: 'changan', name: '翱翔游泳馆', type: '运动', icon: '🏊',
      latitude: 34.030997, longitude: 108.761754,
      address: '校区西侧', description: '游泳馆，游泳课和健身常去',
      tags: ["运动","游泳"], color: 'purple'
    },
    {
      id: 'p09', campus: 'changan', name: '运动场', type: '运动', icon: '⚽',
      latitude: 34.023004, longitude: 108.760959,
      address: '校区南侧', description: '田径场、足球场和各类球场',
      tags: ["运动","跑步","足球","田径"], color: 'purple'
    },
    {
      id: 'p10', campus: 'changan', name: '星天苑南餐厅', type: '食堂', icon: '🍜',
      latitude: 34.034836, longitude: 108.762837,
      address: '星天苑生活区', description: '一楼是大学生超市，二、三楼是餐厅',
      tags: ["食堂","吃饭","超市"], color: 'orange'
    },
    {
      id: 'p11', campus: 'changan', name: '星天苑北餐厅', type: '食堂', icon: '🍜',
      latitude: 34.036956, longitude: 108.762609,
      address: '星天苑生活区北侧', description: '学生和教职工餐厅',
      tags: ["食堂","吃饭"], color: 'orange'
    },
    {
      id: 'p12', campus: 'changan', name: '云天苑餐厅', type: '食堂', icon: '🍜',
      latitude: 34.034821, longitude: 108.767052,
      address: '云天苑生活区', description: '云天苑生活区食堂',
      tags: ["食堂","吃饭"], color: 'orange'
    },
    {
      id: 'p13', campus: 'changan', name: '海天苑餐厅', type: '食堂', icon: '🍜',
      latitude: 34.026501, longitude: 108.761097,
      address: '海天苑生活区', description: '海天苑生活区食堂',
      tags: ["食堂","吃饭"], color: 'orange'
    },
    {
      id: 'p14', campus: 'changan', name: '大学生超市', type: '生活', icon: '🛒',
      latitude: 34.034657, longitude: 108.763025,
      address: '星天苑南餐厅一楼', description: '生活超市，日用品、零食都有',
      tags: ["超市","购物","生活用品"], color: 'orange'
    },
    {
      id: 'p15', campus: 'changan', name: '星天苑宿舍', type: '宿舍', icon: '🛏️',
      latitude: 34.03463, longitude: 108.763549,
      address: '校区北侧生活区', description: '本科生宿舍区之一',
      tags: ["宿舍","住宿"], color: 'green'
    },
    {
      id: 'p16', campus: 'changan', name: '云天苑宿舍', type: '宿舍', icon: '🛏️',
      latitude: 34.036304, longitude: 108.767111,
      address: '校区东北侧', description: '宿舍区',
      tags: ["宿舍","住宿"], color: 'green'
    },
    {
      id: 'p17', campus: 'changan', name: '海天苑宿舍', type: '宿舍', icon: '🛏️',
      latitude: 34.027747, longitude: 108.761615,
      address: '校区南侧', description: '宿舍区，含留学生公寓',
      tags: ["宿舍","住宿","留学生"], color: 'green'
    },
    {
      id: 'p18', campus: 'changan', name: '校医院', type: '医疗', icon: '🏥',
      latitude: 34.034546, longitude: 108.770939,
      address: '教学区东侧教职工生活区旁', description: '长安校区医院，急诊电话 029-88430120',
      tags: ["医疗","医院","看病","急诊"], color: 'red'
    },
    {
      id: 'p19', campus: 'changan', name: '工程实践训练中心', type: '教学楼', icon: '🔧',
      latitude: 34.034724, longitude: 108.760208,
      address: '校区西侧', description: '机械加工、电子类实践课的上课地点',
      tags: ["实践","实习","金工"], color: 'blue'
    },
    {
      id: 'p20', campus: 'changan', name: '东门公交站', type: '公交站', icon: '🚌',
      latitude: 34.0299, longitude: 108.769836,
      address: '校区东门外', description: '途经：333路、774路、高新城乡7号线',
      tags: ["公交站","公交","出行","市区","333路","774路"], color: 'blue'
    },
    {
      id: 'p21', campus: 'changan', name: '小东门公交站', type: '公交站', icon: '🚌',
      latitude: 34.033272, longitude: 108.770048,
      address: '校区小东门外', description: '途经：774路、高新旅游1号线、346路、346路区间（346路可换乘地铁6号线）',
      tags: ["公交站","公交","出行","346路","774路","地铁"], color: 'blue'
    },
    {
      id: 'p22', campus: 'changan', name: '西工大长安校区公交站', type: '公交站', icon: '🚌',
      latitude: 34.037741, longitude: 108.765163,
      address: '校区北侧', description: '途经：高新城乡10号线、774路、高新城乡2号线、346路区间、333路',
      tags: ["公交站","公交","出行","333路","774路"], color: 'blue'
    },
    {
      id: 'p23', campus: 'changan', name: '环山路口公交站', type: '公交站', icon: '🚌',
      latitude: 34.024955, longitude: 108.770561,
      address: '校区南侧环山路口', description: '途经：环山1号线、332路、333路，可去环山路方向',
      tags: ["公交站","公交","出行","环山路","332路","333路"], color: 'blue'
    },
    {
      id: 'p24', campus: 'changan', name: '长安东大公交站', type: '公交站', icon: '🚌',
      latitude: 34.037487, longitude: 108.770314,
      address: '东大镇', description: '途经：高新城乡8号线、333路、774路',
      tags: ["公交站","公交","出行"], color: 'blue'
    },
    {
      id: 'p25', campus: 'changan', name: '东大村二街公交站', type: '公交站', icon: '🚌',
      latitude: 34.040015, longitude: 108.770512,
      address: '东大村', description: '途经：高新城乡7号线、高新旅游1号线、高新城乡2号线、高新城乡10号线',
      tags: ["公交站","公交","出行"], color: 'blue'
    },
    {
      id: 'p26', campus: 'changan', name: '校车候车厅（长安校区）', type: '校车站', icon: '🚍',
      latitude: 34.03545, longitude: 108.76528,
      address: '翱翔学生中心西北侧（泰山路）', description: '往返友谊校区的校车在这里候车；班次约 9:30 / 12:30 / 17:00，具体以学校公告为准',
      tags: ["校车","班车","出行","友谊校区"], color: 'purple'
    },


    {
      id: 'p27', campus: 'changan', name: '星天苑篮球场', type: '运动', icon: '🏀',
      latitude: 34.03528, longitude: 108.76448,
      address: '星天苑生活区', description: '露天篮球场，晚上有灯光，宿舍楼旁步行可达（坐标估算，待实测）',
      tags: ["运动","篮球"], color: 'purple'
    },
    {
      id: 'p28', campus: 'changan', name: '海天苑篮球场', type: '运动', icon: '🏀',
      latitude: 34.02692, longitude: 108.76242,
      address: '海天苑生活区', description: '海天苑附近的露天篮球场（坐标估算，待实测）',
      tags: ["运动","篮球"], color: 'purple'
    },
    {
      id: 'p29', campus: 'changan', name: '网球场', type: '运动', icon: '⚽',
      latitude: 34.03422, longitude: 108.76958,
      address: '翱翔体育馆东侧', description: '网球场（坐标估算，待实测）',
      tags: ["运动","网球"], color: 'purple'
    },
    {
      id: 'p30', campus: 'changan', name: '健身房', type: '运动', icon: '🏊',
      latitude: 34.03102, longitude: 108.76172,
      address: '翱翔游泳馆附近', description: '校内健身房，通常和游泳馆配套（坐标估算，待实测）',
      tags: ["运动","健身"], color: 'purple'
    },
    {
      id: 'p31', campus: 'changan', name: '航天学院', type: '学院', icon: '🏛️',
      latitude: 34.03822, longitude: 108.76682,
      address: '校区东北侧三航区', description: '航天学院（飞天楼），三航特色学院之一（坐标估算，待实测）',
      tags: ["学院","航天","三航"], color: 'blue'
    },
    {
      id: 'p32', campus: 'changan', name: '航空学院', type: '学院', icon: '🏛️',
      latitude: 34.03791, longitude: 108.76562,
      address: '校区东北侧三航区', description: '航空学院，三航特色学院之一（坐标估算，待实测）',
      tags: ["学院","航空","三航"], color: 'blue'
    },
    {
      id: 'p33', campus: 'changan', name: '航海学院', type: '学院', icon: '🏛️',
      latitude: 34.03752, longitude: 108.76444,
      address: '校区北侧三航区', description: '航海学院，三航特色学院之一（坐标估算，待实测）',
      tags: ["学院","航海","三航"], color: 'blue'
    },
    {
      id: 'p34', campus: 'changan', name: '自动化学院', type: '学院', icon: '🏛️',
      latitude: 34.03132, longitude: 108.76272,
      address: '教学西楼附近', description: '自动化学院（坐标估算，待实测）',
      tags: ["学院","自动化"], color: 'blue'
    },
    {
      id: 'p35', campus: 'changan', name: '电子信息学院', type: '学院', icon: '🏛️',
      latitude: 34.03172, longitude: 108.76352,
      address: '教学区西侧', description: '电子信息学院（坐标估算，待实测）',
      tags: ["学院","电子信息"], color: 'blue'
    },
    {
      id: 'p36', campus: 'changan', name: '计算机学院', type: '学院', icon: '🏛️',
      latitude: 34.03402, longitude: 108.76602,
      address: '教学区东侧', description: '计算机学院（坐标估算，待实测）',
      tags: ["学院","计算机"], color: 'blue'
    },
    {
      id: 'p37', campus: 'changan', name: '软件学院', type: '学院', icon: '🏛️',
      latitude: 34.03362, longitude: 108.76642,
      address: '教学区东侧', description: '软件学院（坐标估算，待实测）',
      tags: ["学院","软件"], color: 'blue'
    },
    {
      id: 'p38', campus: 'changan', name: '材料学院', type: '学院', icon: '🏛️',
      latitude: 34.03322, longitude: 108.76712,
      address: '教学区东侧', description: '材料学院（坐标估算，待实测）',
      tags: ["学院","材料"], color: 'blue'
    },
    {
      id: 'p39', campus: 'changan', name: '机电学院', type: '学院', icon: '🏛️',
      latitude: 34.03282, longitude: 108.76772,
      address: '教学区东侧', description: '机电学院（坐标估算，待实测）',
      tags: ["学院","机电"], color: 'blue'
    },
    {
      id: 'p40', campus: 'changan', name: '力学与土木建筑学院', type: '学院', icon: '🏛️',
      latitude: 34.03252, longitude: 108.76832,
      address: '教学区东侧', description: '力学与土木建筑学院（坐标估算，待实测）',
      tags: ["学院","力学","土木"], color: 'blue'
    },
    {
      id: 'p41', campus: 'changan', name: '理学院', type: '学院', icon: '🏛️',
      latitude: 34.03242, longitude: 108.76312,
      address: '教学区西侧', description: '理学院（数学、物理、化学等）（坐标估算，待实测）',
      tags: ["学院","理科"], color: 'blue'
    },
    {
      id: 'p42', campus: 'changan', name: '外国语学院', type: '学院', icon: '🏛️',
      latitude: 34.03202, longitude: 108.76242,
      address: '教学区西侧', description: '外国语学院（坐标估算，待实测）',
      tags: ["学院","外语"], color: 'blue'
    },
    {
      id: 'p43', campus: 'changan', name: '人文与经法学院', type: '学院', icon: '🏛️',
      latitude: 34.03172, longitude: 108.76182,
      address: '教学区西侧', description: '人文与经法学院（坐标估算，待实测）',
      tags: ["学院","人文","法学"], color: 'blue'
    },
    {
      id: 'p44', campus: 'changan', name: '微电子学院', type: '学院', icon: '🏛️',
      latitude: 34.03442, longitude: 108.76682,
      address: '教学区东侧', description: '微电子学院（坐标估算，待实测）',
      tags: ["学院","微电子"], color: 'blue'
    },
    {
      id: 'p45', campus: 'changan', name: '启真湖', type: '风景', icon: '🏊',
      latitude: 34.03042, longitude: 108.76532,
      address: '图书馆周围', description: '图书馆建在湖上，湖边步道适合散步晨读（坐标估算，待实测）',
      tags: ["风景","散步","湖"], color: 'green'
    },
    {
      id: 'p46', campus: 'changan', name: '快递服务中心', type: '生活', icon: '🛒',
      latitude: 34.03502, longitude: 108.76362,
      address: '星天苑生活区', description: '快递代收点，取件常来这里（坐标估算，待实测）',
      tags: ["快递","取件","生活"], color: 'orange'
    },
    {
      id: 'p47', campus: 'changan', name: '行政楼', type: '服务', icon: '🏛️',
      latitude: 34.03282, longitude: 108.76522,
      address: '校区中部', description: '行政办公，办理各种手续常来（坐标估算，待实测）',
      tags: ["行政","办公","服务"], color: 'blue'
    },

    // ========== 友谊校区（老校区 · 碑林区友谊西路127号） ==========
    // 坐标说明：y01-y04 校门中 y02西门/y03南门来自高德（GCJ-02），
    //           其余为估算位置，待腾讯 API 配额恢复后精确校准
    {
      id: 'y01', campus: 'youyi', name: '正门（北门）', type: '校门', icon: '🚪',
      latitude: 34.246, longitude: 108.9153,
      address: '碑林区友谊西路127号', description: '友谊校区面向友谊西路的主校门',
      tags: ["校门","正门"], color: 'red'
    },
    {
      id: 'y02', campus: 'youyi', name: '西门', type: '校门', icon: '🚪',
      latitude: 34.244596, longitude: 108.910507,
      address: '劳动南路侧', description: '临劳动南路，近西工大西门人行天桥',
      tags: ["校门"], color: 'red'
    },
    {
      id: 'y03', campus: 'youyi', name: '南门', type: '校门', icon: '🚪',
      latitude: 34.241442, longitude: 108.916882,
      address: '校区南侧', description: '友谊校区北区南门，进出主校区常用',
      tags: ["校门"], color: 'red'
    },
    {
      id: 'y04', campus: 'youyi', name: '东门', type: '校门', icon: '🚪',
      latitude: 34.2438, longitude: 108.9176,
      address: '白庙路侧', description: '友谊校区东侧校门（位置待核对）',
      tags: ["校门"], color: 'red'
    },
    {
      id: 'y05', campus: 'youyi', name: '老图书馆', type: '学习', icon: '📚',
      latitude: 34.2455, longitude: 108.9148,
      address: '校区内', description: '掩映在梧桐树中的老图书馆，很有年代感',
      tags: ["图书馆","自习"], color: 'blue'
    },
    {
      id: 'y06', campus: 'youyi', name: '新图书馆', type: '学习', icon: '📚',
      latitude: 34.2463, longitude: 108.9141,
      address: '校区内', description: '友谊校区新图书馆（东馆/西馆），自习常去',
      tags: ["图书馆","自习"], color: 'blue'
    },
    {
      id: 'y07', campus: 'youyi', name: '诚字楼', type: '教学楼', icon: '🏫',
      latitude: 34.245, longitude: 108.9138,
      address: '教学区', description: '友谊校区主要教学楼之一，很多课程在这里上',
      tags: ["教学楼","上课"], color: 'blue'
    },
    {
      id: 'y08', campus: 'youyi', name: '爱生楼（食堂）', type: '食堂', icon: '🍜',
      latitude: 34.2446, longitude: 108.9142,
      address: '校区中部', description: '友谊校区餐厅集中地：学生一/二餐厅、风味小吃城、美食广场都在这里',
      tags: ["食堂","吃饭","美食"], color: 'orange'
    },
    {
      id: 'y09', campus: 'youyi', name: '翱翔体育馆', type: '运动', icon: '🏀',
      latitude: 34.24668, longitude: 108.91308,
      address: '校区北侧', description: '友谊校区体育馆，体育课和比赛场地',
      tags: ["运动","体育馆"], color: 'purple'
    },
    {
      id: 'y10', campus: 'youyi', name: '田径场', type: '运动', icon: '⚽',
      latitude: 34.2472, longitude: 108.9138,
      address: '校区北侧', description: '操场和田径场，跑步运动的好去处',
      tags: ["运动","跑步","操场"], color: 'purple'
    },
    {
      id: 'y11', campus: 'youyi', name: '校医院', type: '医疗', icon: '🏥',
      latitude: 34.244, longitude: 108.9155,
      address: '校区内', description: '友谊校区校医院',
      tags: ["医疗","医院"], color: 'red'
    },
    {
      id: 'y12', campus: 'youyi', name: '学生宿舍', type: '宿舍', icon: '🛏️',
      latitude: 34.2425, longitude: 108.9145,
      address: '校区南侧', description: '友谊校区学生宿舍区（位置待核对）',
      tags: ["宿舍","住宿"], color: 'green'
    },
    {
      id: 'y13', campus: 'youyi', name: '大礼堂', type: '活动', icon: '🎭',
      latitude: 34.2456, longitude: 108.9152,
      address: '校区内', description: '友谊校区大礼堂，报告和演出常在这里',
      tags: ["活动","演出","报告"], color: 'purple'
    },
    {
      id: 'y14', campus: 'youyi', name: '校车站（友谊校区）', type: '校车站', icon: '🚍',
      latitude: 34.244, longitude: 108.915,
      address: '校区内', description: '往返长安校区的校车候车点（位置待核对）',
      tags: ["校车","班车","出行"], color: 'purple'
    },
  ]
};