import { PageInfo } from './app';

export interface NewsItem {
  title: string; // 新闻标题
  link: string; // 新闻链接
  source: string; // 新闻来源
  time: string; // 新闻发布时间（（源网站数据或者请求时间，不准确）
  tag?: string; // 新闻标签
  avatar?: string; // 新闻头像
  username?: string; // 新闻作者
  newsImg?: string; // 新闻图片
}

export interface NewsData {
  news: NewsItem[];
  timestamp: number;
}

export interface NewsDisplay {
  news: NewsItem[];
  pageInfo: PageInfo;
}

interface LabelUri {
  uri: string;
  url: string;
  width: number;
  height: number;
  url_list: { url: string }[] | null;
  image_type: number;
}

interface Image {
  uri: string;
  url: string;
  width: number;
  height: number;
  url_list: { url: string }[];
  image_type: number;
}

interface HotItem {
  ClusterId: number;
  Title: string;
  LabelUrl: string;
  Label: string;
  Url: string;
  HotValue: string;
  Schema: string;
  LabelUri: LabelUri;
  ClusterIdStr: string;
  ClusterType: number;
  QueryWord: string;
  InterestCategory: string[];
  Image: Image;
  LabelDesc?: string;
}

export interface ToutiaoHotResponse {
  data: HotItem[];
  fixed_top_data: unknown; // 如果有具体结构，可进一步定义
  fixed_top_style: string;
  impr_id: string;
  status: string;
}

export interface BilibiliHotResponse {
  code: number;
  message: string;
  ttl: number;
  data: {
    note: string;
    list: BilibiliHotItem[];
  };
}

interface BilibiliHotItem {
  aid: number;
  videos: number;
  tid: number;
  tname: string;
  copyright: number;
  pic: string;
  title: string;
  pubdate: number;
  ctime: number;
  desc: string;
  state: number;
  duration: number;
  mission_id: number;
  rights: {
    bp: number;
    elec: number;
    download: number;
    movie: number;
    pay: number;
    hd5: number;
    no_reprint: number;
    autoplay: number;
    ugc_pay: number;
    is_cooperation: number;
    ugc_pay_preview: number;
    no_background: number;
    arc_pay: number;
    pay_free_watch: number;
  };
  owner: {
    mid: number;
    name: string;
    face: string;
  };
  stat: {
    aid: number;
    view: number;
    danmaku: number;
    reply: number;
    favorite: number;
    coin: number;
    share: number;
    now_rank: number;
    his_rank: number;
    like: number;
    dislike: number;
    vt: number;
    vv: number;
    fav_g: number;
    like_g: number;
  };
  dynamic: string;
  cid: number;
  dimension: {
    width: number;
    height: number;
    rotate: number;
  };
  short_link_v2: string;
  first_frame: string;
  pub_location: string;
  cover43: string;
  tidv2: number;
  tnamev2: string;
  pid_v2: number;
  pid_name_v2: string;
  bvid: string;
  score: number;
  enable_vt: number;
}
