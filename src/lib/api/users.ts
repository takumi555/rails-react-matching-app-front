import client from "lib/api/client"
import { UpdateUserFormData } from "interfaces/index"

import Cookies from "js-cookie"

// 都道府県が同じで性別の異なるユーザ情報一覧を取得(自分以外)
export const getUsers = () => {
  return client.get("users", { headers: {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid")
  }
  })
}

// id指定でユーザー情報を取得
export const getUser = (id: number | undefined ) => {
  return client.get(`users/${id}`)
}

// ユーザ情報を更新
export const updateUser = (id: number | undefined ) => {
  return client.put(`users/${id}`)
}
