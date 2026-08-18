/**
 * 全国中小学新课标教材（部编版/人教版/苏教版/北师大版）与幼儿园五大领域权威大纲课程知识库
 * 包含学段、年级、学科、单元主题、精选经典课题、核心素养侧重及推荐教法
 */

export interface CurriculumTopic {
  title: string;
  unit: string;
  competency?: string;
  style?: string;
  keyPoints?: string;
}

export interface CurriculumUnit {
  unitName: string;
  topics: string[];
  competencyFocus?: string;
}

export interface SubjectCurriculum {
  subject: string;
  units: CurriculumUnit[];
}

export interface GradeCurriculum {
  grade: string;
  stage: 'kindergarten' | 'primary' | 'junior' | 'senior' | 'vocational_higher';
  stageLabel: string;
  subjects: SubjectCurriculum[];
}

export const STAGES_LIST = [
  { id: 'kindergarten', label: '幼儿园 (3-6岁)', defaultGrade: '幼儿园中班 (4-5岁)' },
  { id: 'primary', label: '小学 (1-6年级)', defaultGrade: '小学三年级' },
  { id: 'junior', label: '初中 (7-9年级)', defaultGrade: '初中八年级 (初二)' },
  { id: 'senior', label: '高中 (高一-高三)', defaultGrade: '高中一年级 (高一)' },
  { id: 'vocational_higher', label: '中职与高职大学', defaultGrade: '大学本科/专科' }
];

export const CURRICULUM_DATABASE: GradeCurriculum[] = [
  // ================= 幼儿园 =================
  {
    grade: '幼儿园小班 (3-4岁)',
    stage: 'kindergarten',
    stageLabel: '幼儿园',
    subjects: [
      {
        subject: '健康领域 (身心健康/生活习惯)',
        units: [
          {
            unitName: '主题一：我爱我的幼儿园与自理好习惯',
            topics: ['《小手真干净 (洗手七步儿歌)》', '《咕噜噜，漱漱口》', '《自己吃饭香喷喷》', '《不乱跑，排好队》', '《入园不哭闹，抱抱老师》'],
            competencyFocus: '生活自理能力与集体安全适应'
          },
          {
            unitName: '主题二：我的身体真奇妙与趣味体能',
            topics: ['《小小耳朵听一听》', '《大眼睛看世界》', '《小脚丫走走走》', '《小兔蹦蹦跳》', '《小熊爬爬乐》'],
            competencyFocus: '身体感官认知与大肌肉基本动作发展'
          }
        ]
      },
      {
        subject: '语言领域 (倾听表达/绘本阅读)',
        units: [
          {
            unitName: '主题一：温馨绘本与儿歌诵读',
            topics: ['《拔萝卜》', '《小兔乖乖》', '《好饿的毛毛虫》', '《我妈妈》', '《点点点》'],
            competencyFocus: '倾听理解与简单短句大胆表达'
          },
          {
            unitName: '主题二：礼貌问候与生活表达',
            topics: ['《我会说“谢谢”与“再见”》', '《老师早上好》', '《请你帮帮我》', '《小动物的叫声》'],
            competencyFocus: '礼貌文明交往与口语发音'
          }
        ]
      },
      {
        subject: '社会领域 (人际交往/情感适应)',
        units: [
          {
            unitName: '主题一：好朋友在一起',
            topics: ['《我们都是好朋友》', '《玩具大家一起玩》', '《我不争抢，轮流玩》', '《找朋友抱一抱》'],
            competencyFocus: '分享意识与同伴友好相处'
          }
        ]
      },
      {
        subject: '科学领域 (感知探究/数理认知)',
        units: [
          {
            unitName: '主题一：形状、颜色与大小感知',
            topics: ['《认识红黄蓝三原色》', '《圆圆的物体在哪里》', '《比大小与高矮》', '《给小动物喂苹果 (1和许多)》'],
            competencyFocus: '直观感官辨别与初步数概念感知'
          },
          {
            unitName: '主题二：大自然小秘密',
            topics: ['《吹泡泡真好玩》', '《摸一摸，软和硬》', '《踩影子游戏》', '《秋天的小落叶》'],
            competencyFocus: '对周围事物的好奇心与触觉探索'
          }
        ]
      },
      {
        subject: '艺术领域 (音乐律动/美工涂鸦)',
        units: [
          {
            unitName: '主题一：手指点画与快乐涂鸦',
            topics: ['《手指点画：红红的苹果》', '《小雨滴落下来 (线条练习)》', '《给小熊穿花衣》', '《彩泥搓圆子》'],
            competencyFocus: '小肌肉精细动作与色彩感知'
          },
          {
            unitName: '主题二：律动与音乐游戏',
            topics: ['《小手拍拍》', '《走路轻悄悄 (猫行)》', '《大苹果儿歌》', '《洋娃娃和小熊跳舞》'],
            competencyFocus: '节拍律动感知与音乐愉悦体验'
          }
        ]
      }
    ]
  },
  {
    grade: '幼儿园中班 (4-5岁)',
    stage: 'kindergarten',
    stageLabel: '幼儿园',
    subjects: [
      {
        subject: '科学领域 (科学探究/数学认知)',
        units: [
          {
            unitName: '主题一：神奇的物理自然探究',
            topics: ['《沉与浮的秘密》', '《影子变变变 (光影探秘)》', '《神奇的磁铁》', '《水的不思议 (流动与溶解)》', '《吹泡泡的七彩秘密》'],
            competencyFocus: '观察猜想、动手实验与符号记录'
          },
          {
            unitName: '主题二：数理逻辑与几何空间',
            topics: ['《认识数字1-10与守恒》', '《几何图形拼拼乐 (正方形/三角形/圆形)》', '《按规律排序 (ABAB/AABB)》', '《左右方位与空间探秘》'],
            competencyFocus: '数理逻辑思维与图形组合创造力'
          }
        ]
      },
      {
        subject: '语言领域 (倾听与表达/早期阅读)',
        units: [
          {
            unitName: '主题一：经典绘本赏析与续编',
            topics: ['《猜猜我有多爱你》', '《母鸡萝丝去散步》', '《要是你给老鼠吃饼干》', '《三只小猪盖房子》'],
            competencyFocus: '图画线索推测与创造性连贯讲述'
          },
          {
            unitName: '主题二：讲述与语言游戏',
            topics: ['《我的一天 (看图连贯讲述)》', '《奇妙的拟声词王国》', '《绕口令与趣味字谜》'],
            competencyFocus: '口语表达流畅性与语言节奏感'
          }
        ]
      },
      {
        subject: '健康领域 (身体协调/安全自我保护)',
        units: [
          {
            unitName: '主题一：身体技能与体育游戏',
            topics: ['《勇敢的小兵 (平衡木与障碍跑)》', '《跳绳与双脚连续跳》', '《花样玩球与运球》'],
            competencyFocus: '身体平衡性、灵敏性与耐力'
          },
          {
            unitName: '主题二：饮食营养与安全自护',
            topics: ['《不挑食，营养好》', '《小心烫伤与触电》', '《红绿灯眨眼睛 (交通安全)》'],
            competencyFocus: '自我保护意识与健康饮食习惯'
          }
        ]
      },
      {
        subject: '艺术领域 (美术创意/音乐剧)',
        units: [
          {
            unitName: '主题一：综合材料与手工创意',
            topics: ['《秋天的树叶拓印画》', '《纸盘动物创意秀》', '《彩泥立体蔬果雕塑》', '《撕纸拼贴画》'],
            competencyFocus: '空间审美构图与材料多元探索'
          }
        ]
      }
    ]
  },
  {
    grade: '幼儿园大班 (5-6岁)',
    stage: 'kindergarten',
    stageLabel: '幼儿园',
    subjects: [
      {
        subject: '科学领域 (探究/幼小衔接数学)',
        units: [
          {
            unitName: '主题一：幼小衔接数认知与测量',
            topics: ['《10以内的组成与分解 (分合算式)》', '《10以内的加减法应用题》', '《认识时钟 (整点与半点)》', '《自然测量 (用积木/纸条量长短)》', '《认识日历与星期》'],
            competencyFocus: '符号表征、时间观念与逻辑运算初步'
          },
          {
            unitName: '主题二：生命与自然科学探秘',
            topics: ['《植物生长的秘密 (种子发芽日记)》', '《昆虫大世界》', '《水的三态变化 (雨雪冰)》', '《神奇的传声筒》'],
            competencyFocus: '长期观察记录与科学探究方法'
          }
        ]
      },
      {
        subject: '语言领域 (前书写/前阅读/演讲)',
        units: [
          {
            unitName: '主题一：前阅读与前书写准备',
            topics: ['《有趣的汉字象形字演变》', '《我的毕业离园纪念册》', '《看图写话与符号表征》', '《经典绘本《小黑鱼》深度研读》'],
            competencyFocus: '前书写笔顺姿势、符号理解与思辨性表达'
          },
          {
            unitName: '主题二：小小演说家与戏剧表演',
            topics: ['《我自豪的本领 (5分钟脱稿小演讲)》', '《童话剧《拔萝卜》角色扮演与台词》', '《小小新闻播报员》'],
            competencyFocus: '公众自信表达、分角色情绪演练'
          }
        ]
      },
      {
        subject: '社会领域 (规则意识/幼小衔接)',
        units: [
          {
            unitName: '主题一：我要上小学啦',
            topics: ['《参观小学的一天》', '《整理我的小书包》', '《课间十分钟该做什么》', '《做守时专注的小学生》'],
            competencyFocus: '心理角色转变与独立自主习惯养成'
          }
        ]
      }
    ]
  },

  // ================= 小学阶段 =================
  {
    grade: '小学一年级',
    stage: 'primary',
    stageLabel: '小学',
    subjects: [
      {
        subject: '语文',
        units: [
          {
            unitName: '第一单元：识字与走进大自然',
            topics: ['《天地人》', '《金木水火土》', '《口耳目》', '《日月水火》', '《对韵歌》'],
            competencyFocus: '象形识字、笔画规范与传统文化启蒙'
          },
          {
            unitName: '第二单元：汉语拼音基础',
            topics: ['《a o e 韵母学习与发音》', '《b p m f 声母发音与拼读》', '《d t n l 与声调拼读》', '《g k h 与三拼音节》', '《z c s 与整体认读音节》'],
            competencyFocus: '拼读规则、四声调发音与拼音书写'
          },
          {
            unitName: '第四单元：四季之美与童年生活',
            topics: ['《秋天》', '《小小的船》', '《江南》', '《四季》', '《乌鸦喝水》'],
            competencyFocus: '朗读节奏、语言积累与自然之美感知'
          },
          {
            unitName: '第七单元：儿童情趣与自我成长',
            topics: ['《明天要远足》', '《大还是小》', '《项链》', '《青蛙写诗》', '《雪地里的小画家》'],
            competencyFocus: '情感共鸣、标点感知与儿童想象力激发'
          }
        ]
      },
      {
        subject: '数学',
        units: [
          {
            unitName: '第一单元：准备课与位置',
            topics: ['《数一数与比多少》', '《上、下、前、后、左、右 (空间位置)》'],
            competencyFocus: '数感启蒙与空间方位认知'
          },
          {
            unitName: '第二单元：1-5的认识和加减法',
            topics: ['《1-5的认识与书写》', '《比大小 (＞、＜、＝)》', '《第几与几 (基数与序数)》', '《分与合》', '《5以内的加减法与“0”的认识》'],
            competencyFocus: '数感建立与符号运算意识'
          },
          {
            unitName: '第三单元：认识图形与分类',
            topics: ['《认识立体图形 (长方体/正方体/圆柱/球)》', '《物品的分类与整理》'],
            competencyFocus: '直观几何感知与分类思想'
          },
          {
            unitName: '第四单元：6-10的认识和加减法',
            topics: ['《6和7的加减法》', '《8和9的加减法》', '《10的认识与凑十法》', '《连加连减与加减混合运算》'],
            competencyFocus: '运算能力、凑十策略与问题解决'
          },
          {
            unitName: '第五单元：20以内的进位加法',
            topics: ['《9加几 (凑十法专项)》', '《8、7、6加几》', '《5、4、3、2加几》', '《解决排队与组合实际问题》'],
            competencyFocus: '运算敏捷度与转化思想'
          }
        ]
      },
      {
        subject: '道德与法治',
        units: [
          {
            unitName: '第一单元：我是小学生啦',
            topics: ['《开开心心上学去》', '《拉拉手，交朋友》', '《我认识您了，老师》', '《上学路上守安全》'],
            competencyFocus: '角色认同与文明交往'
          }
        ]
      }
    ]
  },
  {
    grade: '小学三年级',
    stage: 'primary',
    stageLabel: '小学',
    subjects: [
      {
        subject: '语文',
        units: [
          {
            unitName: '第一单元：学校生活与大自然之美',
            topics: ['《大青树下的小学》', '《花的学校》', '《不懂就要问》', '《习作：猜猜他是谁》'],
            competencyFocus: '边读边想象画面，关注有新鲜感的词句'
          },
          {
            unitName: '第二单元：秋天景物与观察方法',
            topics: ['《古诗三首 (山行/赠刘景文/夜书所见)》', '《铺满金色巴掌的水泥道》', '《秋天的雨》', '《听听，秋的声音》'],
            competencyFocus: '体会秋天景致，运用多种感官描写景物'
          },
          {
            unitName: '第三单元：童话世界与奇妙想象',
            topics: ['《卖火柴的小女孩》', '《那一定会很好》', '《在牛肚子里旅行》', '《一块奶酪》', '《习作：我来编童话》'],
            competencyFocus: '感受童话丰富的想象，尝试自己创编童话'
          },
          {
            unitName: '第五单元：留心观察与观察记录',
            topics: ['《搭船的鸟》', '《金色的草地》', '《习作例文与习作：我们眼中的缤纷世界》'],
            competencyFocus: '细致观察事物变化，写下观察日记'
          },
          {
            unitName: '第六单元：祖国壮丽河山',
            topics: ['《古诗三首 (望天门山/饮湖上初晴后雨/望洞庭)》', '《富饶的西沙群岛》', '《海滨小城》', '《美丽的小兴安岭》'],
            competencyFocus: '借助关键语句理解一段话的意思，激发爱国情怀'
          }
        ]
      },
      {
        subject: '数学',
        units: [
          {
            unitName: '第一单元：时、分、秒与时间计算',
            topics: ['《秒的认识与体验1秒》', '《时间的简易计算与跨度》'],
            competencyFocus: '量感、时间观念与计算应用'
          },
          {
            unitName: '第二单元：万以内的加法和减法',
            topics: ['《两位数加减两位数口算》', '《三位数加三位数连续进位》', '《三位数减三位数连续退位》', '《加减法的验算与估算策略》'],
            competencyFocus: '运算能力、严谨验算习惯'
          },
          {
            unitName: '第三单元：测量与长度质量单位',
            topics: ['《毫米、分米的认识》', '《千米的认识与实际测量》', '《吨的认识与质量单位换算》'],
            competencyFocus: '量感建立与估测实践'
          },
          {
            unitName: '第四单元：倍的认识',
            topics: ['《倍的概念建立》', '《求一个数是另一个数的几倍》', '《求一个数的几倍是多少的应用题》'],
            competencyFocus: '数理逻辑与乘除模型建构'
          },
          {
            unitName: '第五单元：多位数乘一位数',
            topics: ['《口算乘法 (整十整百数)》', '《笔算乘法 (不进位与连续进位)》', '《有关0的乘法与估算解决问题》'],
            competencyFocus: '算法算理理解与运算能力'
          },
          {
            unitName: '第七单元：长方形和正方形的周长',
            topics: ['《四边形特征与分类》', '《周长的含义与直观测量》', '《长方形和正方形周长公式推导与应用》'],
            competencyFocus: '几何直观、公式推导与空间观念'
          },
          {
            unitName: '第八单元：分数的初步认识',
            topics: ['《几分之一的认识与读写》', '《几分之几与分数大小比较》', '《同分母分数的简单加减法》'],
            competencyFocus: '数概念拓展与平均分本质理解'
          }
        ]
      },
      {
        subject: '英语',
        units: [
          {
            unitName: 'Unit 1: Hello & Greetings',
            topics: ['Lesson 1: Greeting friends and introducing myself', 'Lesson 2: School things and stationery', 'Lesson 3: Phonics (Letters A-D sounds)'],
            competencyFocus: '日常日常问候交际与文具词汇运用'
          },
          {
            unitName: 'Unit 2: Colours & Nature',
            topics: ['Lesson 1: What colour is it?', 'Lesson 2: Painting rainbow & mixing colours', 'Lesson 3: Phonics (Letters E-H sounds)'],
            competencyFocus: '颜色描述与情境句型交际'
          }
        ]
      },
      {
        subject: '科学',
        units: [
          {
            unitName: '第一单元：水的三态变化与蒸发',
            topics: ['《水到哪里去了 (蒸发现象)》', '《水沸腾了 (温度计与沸腾规律)》', '《水结冰了》', '《冰融化了》', '《混合与分离 (食盐与沙子)》'],
            competencyFocus: '对比实验设计与科学探究方法'
          },
          {
            unitName: '第二单元：空气的性质',
            topics: ['《感受空气 (空气占据空间)》', '《空气能被压缩吗》', '《空气有质量吗》', '《风的成因探究》'],
            competencyFocus: '科学证据意识与实验建模'
          }
        ]
      }
    ]
  },
  {
    grade: '小学五年级',
    stage: 'primary',
    stageLabel: '小学',
    subjects: [
      {
        subject: '语文',
        units: [
          {
            unitName: '第一单元：万物有灵与借物喻人',
            topics: ['《白鹭》（郭沫若）', '《落花生》（许地山）', '《桂花雨》（琦君）', '《珍珠鸟》（冯骥才）'],
            competencyFocus: '初步了解借物抒情的写作方法，品味细腻语言'
          },
          {
            unitName: '第二单元：提高阅读速度策略单元',
            topics: ['《搭石》', '《将相和》（司马迁《史记》）', '《什么比猎豹的速度更快》', '《冀中的地道战》'],
            competencyFocus: '学习连词成句地读、跳读与抓关键信息快速阅读'
          },
          {
            unitName: '第四单元：家国情怀与爱国诗篇',
            topics: ['《古诗三首 (示儿/题临安邸/己亥杂诗)》', '《少年中国说（节选）》（梁启超）', '《圆明园的毁灭》', '《小岛》'],
            competencyFocus: '体悟爱国报国志向，结合历史背景品味经典名篇'
          },
          {
            unitName: '第八单元：读书明智与思辨研读',
            topics: ['《古人谈读书（论语/朱熹/曾国藩）》', '《忆读书》（冰心）', '《我的“长生果”》（叶文玲）'],
            competencyFocus: '梳理读书方法，领悟阅读之道与批判性思维'
          }
        ]
      },
      {
        subject: '数学',
        units: [
          {
            unitName: '第一单元：小数乘法',
            topics: ['《小数乘整数》', '《小数乘小数》', '《积的近似数》', '《整数乘法运算定律推广到小数》', '《分段计费解决实际问题》'],
            competencyFocus: '数与代数运算、转化思想与实际应用'
          },
          {
            unitName: '第二单元：位置与数对',
            topics: ['《用数对确定物体的位置 (列与行)》', '《方格纸上的图形平移与数对表示》'],
            competencyFocus: '几何直观与平面直角坐标系萌芽'
          },
          {
            unitName: '第三单元：小数除法',
            topics: ['《除数是整数的小数除法》', '《一个数除以小数》', '《商的近似数与循环小数》', '《“进一法”与“去尾法”实际问题》'],
            competencyFocus: '运算精度、无限循环数概念与生活决策'
          },
          {
            unitName: '第五单元：简易方程 (代数思维启蒙)',
            topics: ['《用字母表示数与数量关系》', '《方程的意义与等式的性质》', '《解形如 x±a=b, ax=b 的方程》', '《列方程解决相遇与行程问题》', '《列方程解决和倍/差倍问题》'],
            competencyFocus: '从算术思维到代数建模的跃升'
          },
          {
            unitName: '第六单元：多边形的面积 (转化与割补)',
            topics: ['《平行四边形的面积公式推导》', '《三角形的面积公式推导与变式》', '《梯形的面积公式推导》', '《组合图形面积的割补计算》'],
            competencyFocus: '转化化归思想与面积守恒'
          }
        ]
      }
    ]
  },

  // ================= 初中阶段 =================
  {
    grade: '初中七年级 (初一)',
    stage: 'junior',
    stageLabel: '初中',
    subjects: [
      {
        subject: '语文',
        units: [
          {
            unitName: '第一单元：四季景致与诗意自然',
            topics: ['《春》（朱自清）', '《济南的冬天》（老舍）', '《雨的四季》（刘湛秋）', '《古代诗歌四首 (观沧海/闻王昌龄左迁龙标遥有此寄/次北固山下/天净沙·秋思)》'],
            competencyFocus: '品味修辞手法（比喻/拟人/通感）、朗读重音停连与情景交融'
          },
          {
            unitName: '第二单元：至爱亲情与家庭温暖',
            topics: ['《秋天的怀念》（史铁生）', '《散步》（莫怀戚）', '《散文诗二首 (金色花/荷叶·母亲)》', '《世说新语二则 (咏雪/陈太丘与友期行)》'],
            competencyFocus: '细节描写、以小见大、家庭美德与传统孝悌'
          },
          {
            unitName: '第四单元：人生感悟与品格修养',
            topics: ['《纪念白求恩》（毛泽东）', '《植树的牧羊人》（让·乔诺）', '《走一步，再走一步》（莫顿·亨特）', '《诫子书》（诸葛亮）'],
            competencyFocus: '议论性要素、坚韧意志与奉献精神'
          },
          {
            unitName: '第六单元：想象之翼与童话神话',
            topics: ['《皇帝的新装》（安徒生）', '《天上的街市》（郭沫若）', '《女娲造人》（袁珂）', '《寓言四则 (赫尔墨斯和雕像者/杞人忧天等)》'],
            competencyFocus: '想象与联想、讽刺手法与寓言哲理'
          }
        ]
      },
      {
        subject: '数学',
        units: [
          {
            unitName: '第一章：有理数及其运算',
            topics: ['《正数和负数的概念与实际意义》', '《有理数与数轴》', '《相反数与绝对值的代数及几何意义》', '《有理数加减法法则与运算律》', '《有理数乘除法与乘方运算》', '《科学记数法与有效数字》'],
            competencyFocus: '数系扩充、数形结合与严谨运算法则'
          },
          {
            unitName: '第二章：整式的加减',
            topics: ['《用字母表示数与代数式》', '《单项式与多项式的系数、次数、项》', '《同类项的判定与合并同类项法则》', '《去括号法则与整式化简求值》'],
            competencyFocus: '符号意识、代数抽象与化简恒等变换'
          },
          {
            unitName: '第三章：一元一次方程',
            topics: ['《一元一次方程的概念与等式性质》', '《解一元一次方程 (移项/去括号/去分母)》', '《列方程解决实际问题 (配套/工程/打折销售问题)》', '《列方程解决行程与方案选择问题》'],
            competencyFocus: '方程建模思想与实际应用转化'
          },
          {
            unitName: '第四章：几何图形初步',
            topics: ['《立体图形与平面图形 (展开图)》', '《点、线、面、体与线段的长短比较》', '《角与角的度量 (度分秒换算)》', '《余角和补角的性质与方位角》'],
            competencyFocus: '几何直观、空间观念与规范几何语言表述'
          }
        ]
      },
      {
        subject: '英语',
        units: [
          {
            unitName: 'Starter Units: Welcome to Junior High',
            topics: ['Starter Unit 1: Good morning! (Greetings)', 'Starter Unit 2: What\'s this in English?', 'Starter Unit 3: What color is it?'],
            competencyFocus: '音标认知、字母书写与入门情境问答'
          },
          {
            unitName: 'Unit 1: My name\'s Gina',
            topics: ['Section A: Introducing oneself and asking names', 'Section B: Phone numbers and first/last names'],
            competencyFocus: 'be动词一般现在时与个人信息交流'
          },
          {
            unitName: 'Unit 5: Do you have a soccer ball?',
            topics: ['Section A: Sports equipment and have/has questions', 'Section B: Describing sports and leisure activities'],
            competencyFocus: '一般现在时助动词 do/does 的用法与兴趣爱好表达'
          }
        ]
      },
      {
        subject: '历史',
        units: [
          {
            unitName: '第一单元：史前时期：中国境内早期人类与文明的起源',
            topics: ['《中国早期人类的代表——北京人》', '《原始农耕生活 (河姆渡与半坡居民)》', '《远古的传说 (炎黄联盟与禅让制)》'],
            competencyFocus: '唯物史观、考古证据与中华文明起源探究'
          },
          {
            unitName: '第二单元：夏商周时期：早期国家与社会变革',
            topics: ['《夏商周的更替与分封制》', '《青铜器与甲骨文》', '《春秋时期的经济发展与诸侯争霸》', '《战国时期的百家争鸣与商鞅变法》'],
            competencyFocus: '制度变革、百家争鸣思辨与史料实证'
          },
          {
            unitName: '第三单元：秦汉时期：统一多民族国家的建立和巩固',
            topics: ['《秦统一中国与中央集权制度的建立》', '《秦末农民大起义 (陈胜吴广)》', '《西汉建立和“文景之治”》', '《汉武帝巩固大一统王朝》', '《丝绸之路的开辟与沟通》'],
            competencyFocus: '大一统历史趋势、制度创新与家国情怀'
          }
        ]
      },
      {
        subject: '生物',
        units: [
          {
            unitName: '第一单元：认识生物与生物圈',
            topics: ['《生物的特征》', '《调查周边环境中的生物》', '《生物与环境的关系 (生态因素)》', '《生态系统 (食物链与食物网)》'],
            competencyFocus: '生命观念、生态平衡与科学调查方法'
          },
          {
            unitName: '第二单元：细胞是生命活动的基本单位',
            topics: ['《练习使用显微镜》', '《植物细胞的结构与洋葱表皮装片制作》', '《动物细胞结构与口腔上皮装片制作》', '《细胞的生活与细胞核的功能》'],
            competencyFocus: '实验操作规范、细胞结构模型与微观生命探究'
          }
        ]
      }
    ]
  },
  {
    grade: '初中八年级 (初二)',
    stage: 'junior',
    stageLabel: '初中',
    subjects: [
      {
        subject: '语文',
        units: [
          {
            unitName: '第一单元：新闻传播与纪实文字',
            topics: ['《消息二则 (我三十万大军胜利南渡长江/人民解放军百万大军横渡长江)》', '《首届诺贝尔奖颁发》', '《“飞天”凌空——跳水姑娘吕伟夺魁记》', '《一着惊海天——目击我国航母舰载战斗机首架次成功着舰》'],
            competencyFocus: '新闻六要素、消息与特写结构、语言准确精炼'
          },
          {
            unitName: '第二单元：至爱亲情与品格传记',
            topics: ['《藤野先生》（鲁迅）', '《回忆我的母亲》（朱德）', '《列夫·托尔斯泰》（茨威格）', '《美丽的颜色》（居里夫人传记）'],
            competencyFocus: '人物肖像细节描写、抑扬结合与崇高人格熏陶'
          },
          {
            unitName: '第三单元：古代山水游记与古典诗文',
            topics: ['《三峡》（郦道元）', '《答谢中书书》（陶弘景）', '《记承天寺夜游》（苏轼）', '《与朱元思书》（吴均）', '《唐诗五首 (野望/黄鹤楼/使至塞上/渡荆门送别/钱塘湖春行)》'],
            competencyFocus: '文言实词虚词、骈散相间句式、山水意境与旷达胸襟'
          },
          {
            unitName: '第四单元：散文天地与情感哲思',
            topics: ['《背影》（朱自清）', '《白杨礼赞》（茅盾）', '《散文二篇 (永久的生命/我为什么而活着)》', '《昆明的雨》（汪曾祺）'],
            competencyFocus: '动词细节品读、托物言志、深沉父爱与平淡见真味'
          }
        ]
      },
      {
        subject: '物理',
        units: [
          {
            unitName: '第一章：机械运动',
            topics: ['《长度和时间的测量与误差》', '《运动的描述 (参照物与相对运动)》', '《运动的快慢 (速度公式 v=s/t 及变式计算)》', '《测量物体运动的平均速度 (实验探究)》'],
            competencyFocus: '物理建模、实验测量规范与控制变量法'
          },
          {
            unitName: '第二章：声现象',
            topics: ['《声音的产生与传播 (介质与声速)》', '《声音的特性 (音调、响度、音色及波形辨析)》', '《声的利用 (超声波与次声波)》', '《噪声的危害和控制途径》'],
            competencyFocus: '物理学与生活联系、转换法实验探究'
          },
          {
            unitName: '第三章：物态变化',
            topics: ['《温度计原理与摄氏温标》', '《熔化和凝固 (晶体与非晶体熔化图像分析)》', '《汽化和液化 (沸腾特点与蒸发吸热)》', '《升华和凝华现象及吸放热总结》'],
            competencyFocus: '图像分析法、热现象微观解释与实验安全'
          },
          {
            unitName: '第四章：光现象',
            topics: ['《光的直线传播与小孔成像》', '《光的反射定律与漫反射/镜面反射》', '《平面镜成像特点 (实验探究与等效替代法)》', '《光的折射规律》', '《光的色散与看不见的光》'],
            competencyFocus: '光路作图、等效替代法与模型构建'
          },
          {
            unitName: '第七章：力与运动 (力学核心)',
            topics: ['《力的概念、力的三要素与力的示意图》', '《弹力与弹簧测力计的使用》', '《重力及其大小方向与重心 (G=mg)》', '《牛顿第一定律与惯性 (理想实验法)》', '《二力平衡的条件及受力分析》', '《摩擦力的大小影响因素与应用》'],
            competencyFocus: '理想实验推导、受力分析图解与力学综合思维'
          }
        ]
      },
      {
        subject: '数学',
        units: [
          {
            unitName: '第十一章：三角形',
            topics: ['《与三角形有关的线段 (边长不等式/高/中线/角平分线)》', '《三角形的内角和定理与推论》', '《多边形及其内角和、外角和公式》'],
            competencyFocus: '逻辑证明、分类讨论思想与几何严谨书写'
          },
          {
            unitName: '第十二章：全等三角形',
            topics: ['《全等三角形的性质》', '《三角形全等的判定 (SSS, SAS, ASA, AAS, HL)》', '《角的平分线的性质与判定定理》'],
            competencyFocus: '公理化证明体系、对应顶点意识与辅助线构造'
          },
          {
            unitName: '第十四章：整式的乘法与因式分解',
            topics: ['《幂的运算性质 (同底数幂乘除/幂的乘方/积的乘方)》', '《整式的乘法与乘法公式 (平方差公式/完全平方公式)》', '《因式分解 (提公因式法/公式法/十字相乘法)》'],
            competencyFocus: '代数恒等变形、逆向思维与算法灵活运用'
          },
          {
            unitName: '第十九章：一次函数',
            topics: ['《函数概念与自变量取值范围》', '《一次函数的图像与性质 (k, b的几何意义)》', '《待定系数法求一次函数解析式》', '《一次函数与方程、不等式的综合应用》'],
            competencyFocus: '数形结合思想、函数模型与实际问题最值'
          }
        ]
      },
      {
        subject: '地理',
        units: [
          {
            unitName: '第一章：从世界看中国',
            topics: ['《辽阔的疆域与优越的地理位置》', '《行政区划 (34个省级行政区全景)》', '《众多的人口与人口国策》', '《多民族的大家庭》'],
            competencyFocus: '区域认知、空间地图读图能力与国家版图意识'
          },
          {
            unitName: '第二章：中国的自然环境',
            topics: ['《地形和地势 (三级阶梯与主要地形区)》', '《气候 (季风气候显著与气温降水分布)》', '《河流 (长江的开发与治理/黄河的治理)》', '《自然灾害与防灾减灾》'],
            competencyFocus: '人地协调观、因地制宜与区域生态保护'
          }
        ]
      }
    ]
  },
  {
    grade: '初中九年级 (初三)',
    stage: 'junior',
    stageLabel: '初中',
    subjects: [
      {
        subject: '化学',
        units: [
          {
            unitName: '第一单元：走进化学世界',
            topics: ['《物质的变化和性质 (物理/化学变化对比)》', '《化学是一门以实验为基础的科学 (蜡烛燃烧与呼出气体)》', '《走进化学实验室 (常见仪器使用与药品取用规则)》'],
            competencyFocus: '宏观辨识与微观探析、化学实验规范'
          },
          {
            unitName: '第二单元：我们周围的空气',
            topics: ['《空气的成分与拉瓦锡实验》', '《氧气的性质 (碳/硫/铁丝在氧气中燃烧)》', '《制取氧气 (过氧化氢/高锰酸钾分解与催化剂)》'],
            competencyFocus: '气体制备装置选择原理、性质实验现象对比'
          },
          {
            unitName: '第四单元：自然界的水与物质构成的奥秘',
            topics: ['《爱护水资源与水的净化 (过滤/活性炭吸附)》', '《水的组成与电解水实验 (正氧负氢)》', '《原子的结构与离子》', '《元素与元素周期表》', '《化学式与化合价及质量分数计算》'],
            competencyFocus: '微观结构模型、守恒观念与化学符号定量计算'
          },
          {
            unitName: '第五单元：化学方程式 (定量守恒)',
            topics: ['《质量守恒定律的验证与微观解释》', '《如何正确书写化学方程式 (配平方法)》', '《利用化学方程式的简单计算》'],
            competencyFocus: '质量守恒定律、定量思维与严谨计算格式'
          },
          {
            unitName: '第六单元：碳和碳的氧化物',
            topics: ['《金刚石、石墨和C60 (碳单质的多样性)》', '《二氧化碳制取的研究 (发生与收集装置优化)》', '《二氧化碳和一氧化碳的性质对比》'],
            competencyFocus: '结构决定性质、气体实验室制法通用思维'
          },
          {
            unitName: '第八单元：金属和金属材料',
            topics: ['《金属材料与合金的优良性能》', '《金属的化学性质 (与氧气/酸/盐溶液反应)》', '《金属活动性顺序表探究与判断》', '《金属资源的利用和保护 (铁生锈条件)》'],
            competencyFocus: '对比实验设计、置换反应规律与资源保护'
          }
        ]
      },
      {
        subject: '数学',
        units: [
          {
            unitName: '第二十一章：一元二次方程',
            topics: ['《一元二次方程的一般形式与解的概念》', '《降次——解一元二次方程 (配方法/公式法/因式分解法)》', '《一元二次方程根的判别式 (Δ=b²-4ac)》', '《一元二次方程根与系数的关系 (韦达定理)》', '《实际问题与一元二次方程 (面积/增长率/销售利润)》'],
            competencyFocus: '代数降次思想、分类讨论、公式推导与建模应用'
          },
          {
            unitName: '第二十二章：二次函数 (初中代数巅峰)',
            topics: ['《二次函数的概念与解析式》', '《二次函数 y=ax²+bx+c 的图像与性质 (顶点坐标/对称轴)》', '《待定系数法求二次函数解析式 (一般式/顶点式/交点式)》', '《二次函数与一元二次方程、不等式的综合关系》', '《二次函数实际应用 (利润最大化与桥梁抛物线)》', '《二次函数中的动态几何与几何最值问题》'],
            competencyFocus: '数形结合、转化化归、极值最优化与综合几何代数探究'
          },
          {
            unitName: '第二十四章：圆',
            topics: ['《圆的有关性质 (垂径定理/圆心角与圆周角定理)》', '《点和圆、直线和圆的位置关系 (切线的判定与性质)》', '《正多边形和圆与弧长、扇形面积计算》'],
            competencyFocus: '几何对称性、转化与动态切线辅助线构造'
          }
        ]
      },
      {
        subject: '物理',
        units: [
          {
            unitName: '第十五章：电流和电路',
            topics: ['《两种电荷与原子结构》', '《电流和电路 (电路的三种状态与电路图画法)》', '《串联和并联电路的连接与识别》', '《电流的测量与串并联电路中电流的规律》'],
            competencyFocus: '电路连接规范、类比法理解电流电压'
          },
          {
            unitName: '第十七章：欧姆定律 (电学核心基石)',
            topics: ['《电流与电压和电阻的关系 (控制变量法探究)》', '《欧姆定律的内容、公式 (I=U/R) 及推导计算》', '《电阻的测量 (伏安法测电阻与特殊方法)》', '《欧姆定律在串、并联电路中的动态分析与极值计算》'],
            competencyFocus: '控制变量法、电学动态极值分析与安全用电'
          },
          {
            unitName: '第十八章：电功率与焦耳定律',
            topics: ['《电能和电功 (电能表读数计算)》', '《电功率的概念及公式 (P=UI=W/t)》', '《测量小灯泡的电功率 (额定功率与实际功率)》', '《焦耳定律 (Q=I²Rt) 与电热的利用及防止》'],
            competencyFocus: '能量转化守恒、实验误差分析与安全用电'
          }
        ]
      },
      {
        subject: '语文',
        units: [
          {
            unitName: '第一单元：诗歌咏怀与时代强音',
            topics: ['《沁园春·雪》（毛泽东）', '《我爱这土地》（艾青）', '《乡愁》（余光中）', '《你是人间的四月天》（林徽因）'],
            competencyFocus: '诗歌意象品味、朗读节奏韵律与博大胸襟'
          },
          {
            unitName: '第二单元：小说阅读与人物命运剖析',
            topics: ['《孔乙己》（鲁迅）', '《变色龙》（契诃夫）', '《刘姥姥进大观园》（曹雪芹《红楼梦》）', '《我的叔叔于勒》（莫泊桑）'],
            competencyFocus: '小说三要素、讽刺与批判现实主义、人物性格多面性'
          },
          {
            unitName: '第三单元：古典名篇与文人情怀',
            topics: ['《岳阳楼记》（范仲淹）', '《醉翁亭记》（欧阳修）', '《湖心亭看雪》（张岱）', '《诗词三首 (行路难/酬乐天扬州初逢席上见赠/水调歌头)》'],
            competencyFocus: '先天下之忧而忧的士人担当、借景抒情与白描笔法'
          },
          {
            unitName: '第四单元：议论思辨与说理艺术',
            topics: ['《中国人失掉自信力了吗》（鲁迅）', '《敬业与乐业》（梁启超）', '《就英法联军远征中国致巴特勒上尉的信》（雨果）'],
            competencyFocus: '论点论据论证方法、驳论驳斥技巧与思辨性表达'
          }
        ]
      }
    ]
  },

  // ================= 高中阶段 =================
  {
    grade: '高中一年级 (高一)',
    stage: 'senior',
    stageLabel: '高中',
    subjects: [
      {
        subject: '语文',
        units: [
          {
            unitName: '必修上册 第一单元：青春激扬与革命情怀',
            topics: ['《沁园春·长沙》（毛泽东）', '《红烛》（闻一多）', '《百合花》（茹志鹃）', '《哦，香雪》（铁凝）'],
            competencyFocus: '诗歌意象、青春理想、革命传统与叙事抒情'
          },
          {
            unitName: '必修上册 第三单元：古代诗文经典与生命哲思',
            topics: ['《短歌行》（曹操）', '《归园田居（其一）》（陶渊明）', '《梦游天姥吟留别》（李白）', '《登高》（杜甫）', '《琵琶行并序》（白居易）', '《念奴娇·赤壁怀古》（苏轼）', '《永遇乐·京口北固亭怀古》（辛弃疾）'],
            competencyFocus: '古体诗乐府韵律、知人论世、士人情怀与悲悯风骨'
          },
          {
            unitName: '必修上册 第七单元：自然情怀与写景抒情散文',
            topics: ['《故都的秋》（郁达夫）', '《荷塘月色》（朱自清）', '《我与地坛（节选）》（史铁生）', '《赤壁赋》（苏轼）', '《登泰山记》（姚鼐）'],
            competencyFocus: '借景抒情、情景交融、生命苦难哲思与辞赋骈散结合'
          }
        ]
      },
      {
        subject: '数学',
        units: [
          {
            unitName: '必修第一册 第一章：集合与常用逻辑用语',
            topics: ['《集合的概念与表示方法》', '《集合的基本关系 (子集/真子集)》', '《集合的基本运算 (并集/交集/补集)》', '《充分条件与必要条件》', '《全称量词与存在量词及其否定》'],
            competencyFocus: '数学抽象、逻辑推理与集合语言表述'
          },
          {
            unitName: '必修第一册 第二章：一元二次函数、方程和不等式',
            topics: ['《等式性质与不等式性质》', '《基本不等式 √(ab) ≤ (a+b)/2 及其最值应用》', '《二次函数与一元二次不等式解法 (穿针引线法)》'],
            competencyFocus: '代数不等式变形、极值最优化思维'
          },
          {
            unitName: '必修第一册 第三章：函数的概念与性质 (高中代数基石)',
            topics: ['《函数的概念及其表示法》', '《函数单调性与最大(小)值的证明与应用》', '《函数奇偶性及其几何特征》', '《幂函数的图像与性质》'],
            competencyFocus: '函数的定义域值域、单调奇偶性严格证明与抽象函数思维'
          },
          {
            unitName: '必修第一册 第四章：指数函数与对数函数',
            topics: ['《指数幂的拓展与指数函数 y=a^x 图像性质》', '《对数概念与运算性质 (换底公式)》', '《对数函数 y=log_a(x) 图像与性质》', '《函数与方程 (零点存在性定理与二分法)》'],
            competencyFocus: '反函数关系、数形结合与超越方程零点探究'
          },
          {
            unitName: '必修第一册 第五章：三角函数',
            topics: ['《任意角和弧度制》', '《三角函数的定义 (单位圆)》', '《同角三角函数的基本关系与诱导公式》', '《三角函数的图像与性质 (正弦/余弦/正切)》', '《函数 y=A sin(ωx+φ) 的图像变换与物理应用》'],
            competencyFocus: '周期性现象建模、单位圆几何直观与图像变换规律'
          }
        ]
      },
      {
        subject: '物理',
        units: [
          {
            unitName: '必修第一册 第一章：运动的描述',
            topics: ['《质点、参考系和坐标系》', '《时间与位移 (矢量与标量)》', '《位置变化快慢的描述——速度 (平均速度与瞬时速度)》', '《速度变化快慢的描述——加速度 a=(v-v0)/t》'],
            competencyFocus: '理想化物理模型构建、微元法与极限思想'
          },
          {
            unitName: '必修第一册 第二章：匀变速直线运动的研究',
            topics: ['《匀变速直线运动的速度与时间关系 v=v0+at》', '《匀变速直线运动的位移与时间关系 x=v0t+½at²》', '《速度与位移的关系 v²-v0²=2ax 及推论》', '《自由落体运动与竖直上抛规律》', '《利用打点计时器研究匀变速直线运动 (纸带数据处理)》'],
            competencyFocus: '公式推导推论、v-t图像物理意义与实验数据误差处理'
          },
          {
            unitName: '必修第一册 第三章：相互作用——力',
            topics: ['《重力与重心》', '《弹力与胡克定律 (F=kx)》', '《摩擦力 (静摩擦与滑动摩擦力判定)》', '《力的合成与分解 (平行四边形定则与正交分解)》', '《共点力作用下物体的平衡状态与解题技巧》'],
            competencyFocus: '正交分解法、隔离体与整体法受力分析'
          },
          {
            unitName: '必修第一册 第四章：运动和力的关系 (牛顿运动定律)',
            topics: ['《牛顿第一定律与惯性》', '《实验：探究加速度与力、质量的关系》', '《牛顿第二定律 F=ma 的内涵与瞬时性》', '《牛顿第三定律与作用力反作用力》', '《超重与失重现象探究》', '《牛顿运动定律的综合应用 (传送带/滑块木板模型)》'],
            competencyFocus: '牛顿运动定律综合建模、临界条件分析与动力学两大类问题'
          }
        ]
      },
      {
        subject: '化学',
        units: [
          {
            unitName: '必修第一册 第一章：物质及其变化',
            topics: ['《物质的分类及转化 (树状分类法与交叉分类法)》', '《分散系及其分类 (胶体的丁达尔效应)》', '《离子反应与离子方程式的书写》', '《氧化还原反应的本质与规律 (电子转移与化合价升降)》'],
            competencyFocus: '宏观微观结合、氧化还原电子守恒与离子方程式正误判断'
          },
          {
            unitName: '必修第一册 第二章：海水中的重要元素——钠和氯',
            topics: ['《钠及其氧化物 (Na与水反应/过氧化钠的性质)》', '《氯及其化合物 (氯气的制备与漂白粉原理)》', '《物质的量及其单位摩尔 (n=m/M=V/Vm=N/NA)》', '《一定物质的量浓度溶液的配制与误差分析》'],
            competencyFocus: '物质的量桥梁纽带、容量瓶实验定量操作与元素化合物转化'
          }
        ]
      }
    ]
  },
  {
    grade: '高中二年级 (高二)',
    stage: 'senior',
    stageLabel: '高中',
    subjects: [
      {
        subject: '数学',
        units: [
          {
            unitName: '选择性必修第一册 第一章：空间向量与立体几何',
            topics: ['《空间向量及其线性运算》', '《空间向量的数量积与坐标表示》', '《利用空间向量求空间角 (线线角/线面角/二面角)》', '《利用空间向量求空间距离 (点到平面的距离)》'],
            competencyFocus: '代数化解决几何问题、空间建系法与法向量运算'
          },
          {
            unitName: '选择性必修第一册 第二章：直线和圆的方程',
            topics: ['《直线的倾斜角与斜率》', '《直线方程的五种形式》', '《两条直线的平行与垂直判定及点到直线距离》', '《圆的方程 (标准方程与一般方程)》', '《直线与圆的位置关系 (切线与弦长公式)》'],
            competencyFocus: '解析几何思想、代数方程几何化与数形结合'
          },
          {
            unitName: '选择性必修第一册 第三章：圆锥曲线的方程 (高考核心难点)',
            topics: ['《椭圆的标准方程及其简单几何性质 (离心率/焦点)》', '《双曲线的标准方程及其简单几何性质 (渐近线)》', '《抛物线的标准方程及其简单几何性质》', '《直线与圆锥曲线的位置关系 (联立方程与韦达定理)》', '《圆锥曲线中的弦长、面积、定点定值与最值问题》'],
            competencyFocus: '解析几何高强度运算、韦达定理设而不求与设线法'
          },
          {
            unitName: '选择性必修第二册 第四章：数列',
            topics: ['《数列的概念与通项公式》', '《等差数列的通项公式与前n项和公式推导》', '《等比数列的通项公式与前n项和公式推导》', '《数列求和的常用方法 (错位相减/裂项相消/分组转化)》', '《数列递推公式求通项公式 (累加/累乘/构造法)》'],
            competencyFocus: '离散函数观念、数学归纳与化归转化思想'
          },
          {
            unitName: '选择性必修第二册 第五章：一元函数的导数及其应用 (压轴之王)',
            topics: ['《导数的概念与其几何意义 (切线方程)》', '《导数的运算法则与基本初等函数求导公式》', '《利用导数研究函数的单调性与极值》', '《利用导数研究函数的最大值与最小值》', '《导数在证明不等式中的应用 (构造辅助函数)》', '《导数中的零点存在性与参数取值范围 (分类讨论/分离参数)》'],
            competencyFocus: '高等数学微积分思想、分类讨论极致逻辑与转化化归'
          }
        ]
      },
      {
        subject: '物理',
        units: [
          {
            unitName: '必修第三册 第九章：静电场及其应用',
            topics: ['《电荷及其守恒定律与库仑定律 (F=kQq/r²)》', '《电场与电场强度 (E=F/q=kQ/r²)》', '《静电的防止与利用》'],
            competencyFocus: '场物质观念、矢量叠加与类比万有引力'
          },
          {
            unitName: '必修第三册 第十章：静电场中的能量',
            topics: ['《电势能和电势与电势差 (WAB=qUAB)》', '《电势差与电场强度的关系 (E=U/d)》', '《电容器与电容 (平行板电容器动态分析)》', '《带电粒子在匀强电场中的加速与偏转 (类平抛运动)》'],
            competencyFocus: '功能关系、能量守恒与微观粒子运动轨迹分析'
          },
          {
            unitName: '选择性必修第二册 第一章：电磁感应 (高考热点)',
            topics: ['《磁通量与电磁感应现象的发现》', '《楞次定律 (感应电流方向判断——增反减同)》', '《法拉第电磁感应定律 (E=nΔΦ/Δt 与 E=BLv)》', '《互感和自感与涡流现象》', '《电磁感应中的动力学与能量综合问题 (双棒模型/线框进出磁场)》'],
            competencyFocus: '能量转化与守恒、动态极值分析与电路力学深度交融'
          }
        ]
      },
      {
        subject: '化学',
        units: [
          {
            unitName: '选择性必修1：化学反应原理 (理论核心)',
            topics: ['《化学反应与能量转化 (盖斯定律与反应热ΔH计算)》', '《化学反应速率与影响因素 (有效碰撞理论)》', '《化学平衡状态与平衡常数 K 的计算》', '《化学平衡移动原理 (勒夏特列原理)》', '《弱电解质的电离平衡与水的离子积 Kw》', '《盐类的水解平衡及其在生产生活中的应用》', '《难溶电解质的沉淀溶解平衡 (Ksp与沉淀转化)》', '《原电池与电解池工作原理及新型化学电源》'],
            competencyFocus: '动态平衡思想、速率常数图像分析与定量平衡计算'
          }
        ]
      }
    ]
  }
];

/**
 * 辅助函数：根据学段过滤年级列表
 */
export function getGradesByStage(stageId: string): string[] {
  if (stageId === 'all') {
    return CURRICULUM_DATABASE.map(c => c.grade);
  }
  return CURRICULUM_DATABASE.filter(c => c.stage === stageId).map(c => c.grade);
}

/**
 * 辅助函数：根据年级获取可用学科列表
 */
export function getSubjectsByGrade(gradeName: string): string[] {
  const item = CURRICULUM_DATABASE.find(c => c.grade === gradeName);
  if (!item) return ['语文', '数学', '英语', '科学', '物理', '化学', '生物', '历史', '道德与法治/政治', '地理'];
  return item.subjects.map(s => s.subject);
}

/**
 * 辅助函数：根据年级和学科获取单元主题列表
 */
export function getUnitsByGradeAndSubject(gradeName: string, subjectName: string): CurriculumUnit[] {
  const gradeItem = CURRICULUM_DATABASE.find(c => c.grade === gradeName);
  if (!gradeItem) return [];
  
  // 宽松匹配学科名字（防止如 "健康领域 (身心健康/动作发展)" 与 "健康领域" 的匹配差异）
  const subItem = gradeItem.subjects.find(
    s => s.subject === subjectName || s.subject.includes(subjectName) || subjectName.includes(s.subject.slice(0, 2))
  );
  return subItem ? subItem.units : [];
}

/**
 * 辅助函数：根据单元获取课题列表
 */
export function getTopicsByUnit(gradeName: string, subjectName: string, unitName: string): string[] {
  const units = getUnitsByGradeAndSubject(gradeName, subjectName);
  const foundUnit = units.find(u => u.unitName === unitName);
  return foundUnit ? foundUnit.topics : [];
}

/**
 * 辅助函数：获取特定年级+学科下的所有经典课题
 */
export function getAllTopicsByGradeAndSubject(gradeName: string, subjectName: string): { topic: string; unit: string; competency?: string }[] {
  const units = getUnitsByGradeAndSubject(gradeName, subjectName);
  const all: { topic: string; unit: string; competency?: string }[] = [];
  units.forEach(u => {
    u.topics.forEach(t => {
      all.push({ topic: t, unit: u.unitName, competency: u.competencyFocus });
    });
  });
  return all;
}
