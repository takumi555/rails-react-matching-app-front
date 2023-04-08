import React, { useContext, useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"

import { makeStyles, Theme } from "@material-ui/core/styles"
import { Grid, Typography } from "@material-ui/core"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import IconButton from "@material-ui/core/IconButton"
import SettingsIcon from "@material-ui/icons/Settings"

import Dialog from "@material-ui/core/Dialog"
import TextField from "@material-ui/core/TextField"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"

import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"

import PhotoCamera from "@material-ui/icons/PhotoCamera"
import Box from "@material-ui/core/Box"
import CancelIcon from "@material-ui/icons/Cancel"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import Button from "@material-ui/core/Button"

import Avatar from "@material-ui/core/Avatar"
import Divider from "@material-ui/core/Divider"

import { AuthContext } from "App"
import { prefectures } from "data/prefectures"

import { signOut } from "lib/api/auth"
import { getUser, updateUser } from "lib/api/users"
import { UpdateUserFormData } from "interfaces/index"

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  },
  card: {
    width: 340
  },
  imageUploadBtn: {
    textAlign: "right"
  },
  input: {
    display: "none"
  },
  box: {
    marginBottom: "1.5rem"
  },
  preview: {
    width: "100%"
  }
}))

// ホーム(マイページ的な)
const Home: React.FC = () => {
  const { isSignedIn, setIsSignedIn, currentUser, setCurrentUser } = useContext(AuthContext)

  const classes = useStyles()
  const navigate = useNavigate()

  const [editFormOpen, setEditFormOpen] = useState<boolean>(false)
  const [name, setName] = useState<string | undefined>(currentUser?.name)
  const [prefecture, setPrefecture] = useState<number | undefined>(currentUser?.prefecture || 0)
  const [profile, setProfile] = useState<string | undefined>(currentUser?.profile)
  const [image, setImage] = useState<string>("")
  const [preview, setPreview] = useState<string>("")

  //アップロードした画像の情報を取得
  // useCallback: 第2引数の値が変わるまで、第1引数の関数を再生成しない
  const uploadImage = useCallback((e) => {
    const file = e.target.files[0]
    setImage(file)
  }, [])

  //画像プレビュー
  const previewImage = useCallback((e) => {
    const file = e.target.files[0]
    setPreview(file)
  }, [])

  //生年月日から年齢を計算する 年齢 = floor((今日 - 誕生日) / 10000)
  const currentUserAge = (): number | void => {
    const birthday = currentUser?.birthday.toString().replace(/-/g, "") || ""
    if (birthday.length !== 8) return

    const date = new Date()
    const today = date.getFullYear() + ("0" + (date.getMonth() + 1 )).slice(-2) + ("0" + date.getDate()).slice(-2)

    return Math.floor((parseInt(today) - parseInt(birthday)) / 10000)
  }

  // 都道府県
  const currentUserPrefecture = (): string => {
    return prefectures[(currentUser?.prefecture || 0) - 1]
  }

  const createFormData = (): UpdateUserFormData => {
    const formData = new FormData()

    formData.append("name", name || "")
    formData.append("prefecture", String(prefecture))
    formData.append("profile", profile || "")
    formData.append("image", image)

    return formData
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const data = createFormData()

    try {
      const res = await updateUser(currentUser?.id, data)
      console.log(res)

      if (res.status === 200) {
        setEditFormOpen(false)
        setCurrentUser(res.data.user)
      } else {
        console.log(res.data.message)
      }
    } catch (err) {
      console.log(err)
      console.log("Failed in updating user!")
    }
  }

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const res = await signOut()

      if (res.data.success === true) {
        //cookieから各値を削除
        Cookies.remove("_access_token")
        Cookies.remove("_client")
        Cookies.remove("_uid")

        setIsSignedIn(false)
        // setCurrentUser(undefined)

        navigate("/signin")

        console.log("Signed out successfully!")
      } else {
        console.log(res.data.message)
        console.log("Failed in signing out!")
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
    </>
  )

}

export default Home