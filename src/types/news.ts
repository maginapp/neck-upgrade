import { PageInfo } from './app';

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  time: string;
  tag?: string;
  avatar?: string;
  username?: string;
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
