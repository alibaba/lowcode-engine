export const builtinSearchMap = {
  容器: '容器、rongqi、rq、分栏、ColumnsLayout、Columns、layout、grid',
  分栏: '分栏、ColumnsLayout、Columns、layout、grid、容器、rongqi、rq、fl、fenlan',
  卡片: '卡片、card、kapian、kp',
  选项卡: '选项卡、tab、tabs、页签、xuanxiangka、xxk、yeqian、yq',
  按钮: '按钮、button、anniu、an',
  图标: '图标、icon、tubiao、tb',
  标题: '标题、title、biaoti、bt',
  图片: '图片、image、pic、picture、tupian、tp',
  Dialog: '对话框、Dialog、弹框、弹出框、duihuakuang、dhk',
  Drawer: '抽屉、Drawer、chouti、ct、couti',
  文本: '文本、文字、text、wenzi、wz、wenben',
  链接: '链接、link、lianjie、lj',
  链接块: '链接块、链接、link、lianjie、lj、ljk',
  表单容器: '表单容器、表单、form、biaodan、bd',
  输入框: '输入框、文本框、密码框、input、shurukuang、srk、wenbenkuang、wbk',
  数字输入框: '数字输入框、数字、输入框、Number、NumberPicker、shuzi、sz、srk、shurukuang',
  单选: '单选、radio button、radio、danxuan、dx',
  多选: '复选、复选框、多选、Checkbox、check、fuxuan、fx、dx、duoxuan',
  下拉选择: '下拉选择、Select、选择器、下拉、xiala、xl、xialaxuanze、xlxz',
  开关: '开关、switch、kaiguan、kg',
  日期: '日期选择、date、DatePicker、riqi、riqixuanz、rq、rqxz',
  日期区间: '日期区间、Cascade、date、riqiqujian、rq',
  时间选择框: '时间选择、time、TimePicker、shijian、sj、shijianxuanze、sjxz、xuanzekuang',
  上传图片: '上传图片、upload、上传、shangchuan、sc、tupian',
  上传附件: '上传附件、upload、上传、shangchuan、sc、fujian',
  树形选择: '树形选择、树型选择、树选择、tree、TreeSelect、shu、sxz、shuxingxuanze',
  级联选择: '级联选择、Cascade、Cascadeselect、级联、jilian、jl、jilianxuanze、jlxz',
  地区选择: '地区选择、city、地址、address、地区、diqu、dq、diquxuanze、dqxz',
  国家选择: '国家选择、country、国家、guojia、gj、guojiaxuanze、gjxz',
  评分: '评分、Rate、Rating、星、pingfen、pf',
  明细: '明细、table、表格、表单、form、mingxi、mx',
  穿梭框: '穿梭框、transfer、chuansuokuang、csk',
  人员搜索框: '人员搜索框、employee、人员选择、选人、xuanren、xr、renyuansousuo、ryss',
  筛选: '筛选、pickable、shaixuan、sx',
  金额输入框: '金额输入框、输入框、shurukuang、srk、money、金额、jine、je',
  金额区间: '金额区间、money、金额、jine、je',
  查询: '查询、filter、chaxun、cx',
  表格: '表格、table、biaoge、bg',
  数据文本: '数据文本、Number Info、数据、shuju、sj、shujuwenben、sjwb',
  数据趋势: '数据趋势、Number Trend、数据、shuju、sj、shujuqushi、sjqs',
  勾选框: '勾选框、复选框、check box、gouxuankuang、gxk、fuxuankuang、fxk',
  图片浏览: '图片浏览、图片预览、image、pic、picture、图片、预览、tupianyulan、tupianliulan、tupian、tp、yulan、yl',
  搜索: '搜索、搜索框、查询框、查询、search、sousuo、ss',
  树形控件: '树形控件、树组件、tree、shuzujian、shuxingkongjian、shu、szj、sxkj',
  富文本框: '富文本框、RichText、fuwenben、fwb',
  步骤: '步骤、步骤条、step、steps、buzhoutiao、buzhou、bzt、bz',
  时间轴: '时间轴、时间线、timeline、shijianzhou、shijianxian、sjz、sjx',
  菜单: '菜单、menu、caidan、cd',
  气泡提示: '气泡提示、tip、tips、balloon、气泡、qipao、qp、qipaotishi、qpts',
  面包屑: '面包屑、breadcrumb、crumb、mianbaoxie、mbx',
  日历: '日历、calendar、rili、rl',
  折叠面板: '折叠面板、collapse、折叠、zhedie、zd、zhediemianban、zdmb',
  下拉菜单: '下拉菜单、dropdown、下拉、xiala、xl、xialacaidan、xlcd、菜单、caidan、cd',
  信息提示: '信息提示、message、alert、信息、提示、警示、xinxitishi、xxts、xinxi、xx、tishi、ts、消息、xiaoxi',
  进度指示器: '进度指示器、进度条、progress、jindutiao、jdt、进度、jindu、jd',
  翻页器: '翻页器、分页器、pagination、fanyeqi、fyq、分页、fenye、fy',
  轮播图: '轮播图、图片轮播、slider、轮播、lunbo、lb、lunbotu、lbt',
  底部通栏: '底部通栏、tool bar、通栏、dibutonglan、dbtl、浮动工具条、浮动、工具条、工具、fudong、gongju、toolbar、tool bar、fd、gj',
  HTML: 'html',
  JSX: 'jsx',
  浮动导航: '浮动导航、nav、floatNav、fudongdaohang、fddh',
  Iframe: 'Iframe',
  Markdown: 'Markdown',
  区段选择器: '区段选择、滑块选择、区段、滑块、选择、Range、quduan、huakuai、xuanze、qdxz、hkxz、xz',
};

/**
 * @param {string} title 组件名
 * @param {string} query 搜索词
 * @param {object} map 映射关系
 */
export function searchComponent(title, query, map = {}) {
  if (!title || !query || !map || !map[title]) {
    return false;
  }
  const keys = (map[title] || '').split('、');
  return !!keys.find(key => {
    if (!key) {
      return false;
    }
    return key.indexOf(query) > -1;
  });
}

export function debounce(func, delay) {
  let timer;
  return function (...args) {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      func.apply(this, args);
      clearTimeout(timer);
      timer = null;
    }, delay);
  };
}
