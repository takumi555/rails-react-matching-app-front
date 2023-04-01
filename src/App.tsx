import React, { useState, useEffect, createContext } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import CommonLayout from "components/layouts/CommonLayout"
import Home from "components/pages/Home"
import SignUp from "components/pages/SignUp"
import SignIn from "components/pages/SignIn"

import { getCurrentUser } from "lib/api/auth"
import { User } from "interfaces/index"

// グローバルで使う変数、関数
export const AuthContext = createContext({} as {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>> // ?
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  currentUser: User | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>
} )

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User | undefined>()

  // 認証済みのユーザがいるかチェック
  // 確認できた場合はそのユーザの情報を取得
  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser()
      console.log(res)

      if (res?.status === 200) {
        setIsSignedIn(true)
        setCurrentUser(res?.data.currentUser)
      } else {
        console.log("No current user")
      }
      
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    // この関数をレンダリング後に実行させる
    handleGetCurrentUser() // 実行させたい副作用関数を記述
  }, [setCurrentUser]) // 第2引数には副作用関数の実行タイミングを制御する依存データを記述

  const Private = ({ children }: { children: React.ReactElement }) => {
    if (!loading) {
      if (isSignedIn) {
        //さいんしていたらchildre表示
        return children
      } else {
        //サインインしていなければ、サインインページにリダイレクト
        return <Navigate to="/signin" /> 
      }
    } else {
      return <></>
    }
  }

  return (
    <Router>
      <AuthContext.Provider value={{loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser }}>
        <CommonLayout>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />}  />
            <Route element={<Private><Route path="/" element={<Home />} /></Private>} />
          </Routes>
        </CommonLayout>
      </AuthContext.Provider>
    </Router>
  )
 }

 export default App
