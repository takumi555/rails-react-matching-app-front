import React, { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"

import { makeStyles, Theme } from "@material-ui/core/styles"
import { Grid, TableHead, Typography } from "@material-ui/core"
import Avatar from "@material-ui/core/Avatar"
import TextField from "@material-ui/core/TextField"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import SendIcon from "@material-ui/icons/Send"

import { getChatRoom } from "lib/api/chat_rooms"
import { createMessage } from "lib/api/messages"
import { User, Message } from "interfaces/index"

import { AuthContext } from "App"

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    margin: "0 auto"
  },
  formWrapper: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 340,
  },
  textInputWrapper: {
    width: "100%"
  },
  button: {
    marginLeft: theme.spacing(1)
  },
}))

type ChatRoomProps = any

// チャットルームページ
const ChatRoom: React.FC<ChatRoomProps> = (props) => {
  const classes = useStyles()

  const { currentUser } = useContext(AuthContext)
  const id = parseInt(props.match.params.id)

  const [loading, setLoading] = useState<boolean>(true)
  const [otherUser, setOtherUser] = useState<User>()
  const [messages, setMessages] = useState<Message[]>([])
  const [content, setContent] = useState<string>("")

  const handleGetChatRoom = async () => {
    try {
      const res = await getChatRoom(id)

      if (res.status === 200) {
        setOtherUser(res.data.otherUser)
        setMessages(res.data.messages)
      } else {
        console.log("not chat room")
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    handleGetChatRoom()
  }, [])

  const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()

    const data: Message = {
      chatRoomId: id,
      userId: currentUser?.id,
      content: content
    }

    try {
      const res = await createMessage(data)
      console.log(res)

      if (res.status === 200) {
        setMessages([...messages, res.data.message])
      }
    } catch (err) {
      console.log(err)
    }
  }

  // railsから返ってくるtimestampをdatetimeに変換
  const iso8601ToDateTime = (iso8601: string) => {
    const date = new Date(Date.parse(iso8601))
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minutes = date.getMinutes()

    return `${year}/${month}/${day} ${hour}:${minutes}`
  }

  return (
    <>
      {
        loading ? (
          <div style={{ maxWidth: 360 }}>
            <Grid container justifyContent="center" style={{marginBottom: "1rem"}}>
              <Grid item>
                  <Avatar
                    alt="avatar"
                    src={ otherUser?.image.url || "" }
                    className={classes.avatar}
                  />
                  <Typography
                    variant="body2"
                    component="p"
                    gutterBottom
                    style={{ marginTop: "0.5rem", marginBottom: "1rem", textAlign: "center"  }}                  
                  >
                    {otherUser?.name}
                  </Typography>
              </Grid>
            </Grid>
            {
              messages.map((message: Message, index: number) => {
                return (
                  <Grid key={index} container justifyContent={message.userId === otherUser?.id ? "flex-start" : "flex-end"}>
                    <Grid item>
                      <Box
                        borderRadius={message.userId === otherUser?.id ? "0 30px 30px 30px" : "30px 30px 0px 30px"}
                        bgcolor={message.userId === otherUser?.id ? "#d3d3d3" : "#ffb6c1"}
                        color={message.userId === otherUser?.id ? "#000" : "#fff"}
                        m={1}
                        border={0}
                        style={{padding: "1rem"}}
                      >
                        <Typography variant="body1" component="p">
                          {message.content}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        component="p"
                        color="textSecondary"
                        style={{ textAlign: message.userId === otherUser?.id ? "left" : "right" }}
                      >
                        {iso8601ToDateTime(message.createdAt?.toString() || "100000000")}
                      </Typography>
                    </Grid>
                  </Grid>
                )
              })
            }
            <Grid container justifyContent="center" style={{ marginTop: "2rem" }}>
              <form className={ classes.formWrapper } noValidate autoComplete="off">
                <TextField
                  required
                  multiline
                  value={content}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
                  className={classes.textInputWrapper}
                />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!content ? true : false}
                  className={classes.button}
                >
                  <SendIcon />
                </Button>
              </form>
            </Grid>
          </div>
        ) : (
          <></>
        )
      }
    </>
  )

}

export default ChatRoom