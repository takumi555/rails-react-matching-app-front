export interface SignUpData {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  gender: number
  prefecture: number
  birthday: Date
  image: string
}

export interface SignUpFormData extends FormData {
  append(name: keyof SignUpData, value: string | Blob, fileName?: string): any
}

export interface SignInData {
  email: string
  password: string
}

export interface User {
  id: number
  uid: string
  provider: string
  email: string
  name: string
  image: {
    url: string
  }
  gender: number
  prefecture: number
  birthday: String | number | Date
  allowPasswordChange: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface UpdateUserData {
  id: number | undefined | null
  name?: string
  prefecture?: number
  profile?: string
  image?: string
}

// FormDataという既存のクラスを継承している
// FormData + appendで追加したものが、UpdateUserFormData
// appendは3つの引数を受け取る
// 1つ目: name 追加するフォームのフィールド名 UpdateUserData というインターフェースのプロパティ名のいずれか
// 2つ目: value 追加するフォームの値
// 3つ目: filename オプション　ファイル名をすることができる
export interface UpdateUserFormData extends FormData {
  append(name: keyof UpdateUserData, value: String | Blob, fileName?: string): any
}

// いいね
export interface Like {
  id?: number
  fromUserqId: number | undefined | null
  toUserId: number | undefined | null
}

// チャットルーム
export interface ChatRoom {
  chatRoom: {
    id: number
  }
  otherUser: User
  lastMessage: Message
}

export interface Message {
  chatRoomId: number
  userId: number | undefined
  content: string
  createdAt?: Date
}