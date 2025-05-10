import { UserInfo } from "./user"
import { MenuItem, MenuList } from "./menu"
export type MessageList = MessageItem[]

// 以下是游记相关数据的类型定义
export type LogList = LogItem[]

export type LogStatus = "待审核" | "已通过" | "已拒绝"

export type LogItem = {
  log_id: number             // 游记唯一ID
  title: string              // 游记标题
  content: string            // 游记正文（用于详情展示）
  creator: string            // 创建人
  add_time: string           // 创建时间
  status: LogStatus          // 审核状态
}

// 接口返回类型
export interface LogListApi extends ResponseData {
  data: {
    total: number
    mapKey: MapKey
    list: LogList
  }
}


type MessageItem = {
  add_time: string
  creator: string
  description: string
  m_id: number
  name: string
}
export type MapKey = {
  dataIndex: string
  key: string
  title: string
  width?: number
  [keyname: string]: any
}[]
export interface ResponseData {
  status: number
  msg?: string
}
export interface MessageAPi extends ResponseData {
  data?: {
    total: number
    mapKey: MapKey
    list: MessageList
  }
}

export interface LoginApi extends ResponseData {
  data: UserInfo
  token: string
}
export type PowerList = {
  type_id: number
  name: string
  menu_id: string
}[]

export interface PowerApi extends ResponseData {
  data: PowerList
  mapKey: MapKey
  menu: MenuList
}

export interface MenuInfoApi extends ResponseData {
  data: MenuItem | null
}

export type ResponseUserInfo = {
  account: string
  pswd: string
  type: string
  user_id: number
  username: string
}
export interface UserListApi extends ResponseData {
  data: {
    list: ResponseUserInfo[]
    mapKey: MapKey
  }
  total: number
}

type TimeInfo = {
  time: string
  value: number
}
export interface VisitorApi extends ResponseData {
  data: {
    deal: TimeInfo[]
    ips: TimeInfo[]
    today: {
      deal: number
      ips: number
    }
  }
}

export type VisitData = {
  ip: string
  s_id: number
  status: string
  time: string
  url: string
}

export interface VisitorListApi extends ResponseData {
  data: {
    mapKey: MapKey
    list: VisitData[]
    total: number
  }
}