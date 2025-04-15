"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  TextField,
  IconButton,
  Badge,
  Button,
  Chip,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { Link, useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { arEG } from "date-fns/locale";
import { fetchChatMessages } from "../api/chatApi";
import io from "socket.io-client";
import { getUserID } from "../utils/checkUser.js";
import { masseges } from "../data/fakedata.js";

const ChatPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { id: chatId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null); // افتراضي للاختبار، يجب استبداله بمعرف المستخدم الحقيقي

  const currentUserId = getUserID() || 3; // استبدل هذا بمعرف المستخدم الحقيقي
  // إعداد اتصال Socket.io
  useEffect(() => {
    // إنشاء اتصال Socket.io
    socketRef.current = io("http://localhost:5000"); // استبدل بعنوان الخادم الخاص بك

    // الانضمام إلى غرفة الدردشة
    if (chatId) {
      socketRef.current.emit("join_chat", chatId);
    }

    // استقبال الرسائل الجديدة
    socketRef.current.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // تنظيف عند إزالة المكون
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [chatId]);

  // جلب بيانات المحادثة والرسائل
  // useEffect(() => {
  //   const fetchChatData = async () => {
  //     if (!chatId) return;

  //     setLoading(true);
  //     try {
  //       const response = await fetchChatMessages(chatId);
  //       if (response.status === "success") {
  //         setMessages(response.data || []);

  //         // استخراج بيانات المحادثة من أول رسالة
  //         if (response.data && response.data.length > 0) {
  //           const firstMessage = response.data[0];
  //           setChatData({
  //             chat_id: firstMessage.chat_id,
  //             user_id_1: firstMessage.sender_id,
  //             user_id_2:
  //               currentUserId === firstMessage.sender_id
  //                 ? firstMessage.receiver_id || 1
  //                 : firstMessage.sender_id,
  //             user_1_name: firstMessage.sender_name,
  //           });
  //         }
  //       } else {
  //         setError("حدث خطأ أثناء جلب الرسائل");
  //       }
  //     } catch (err) {
  //       setError(`حدث خطأ: ${err.message}`);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchChatData();
  // }, [chatId, currentUserId]);

  // التمرير إلى آخر رسالة عند تحديث الرسائل
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (message.trim() === "" || !chatId) return;

    // إرسال الرسالة عبر Socket.io
    if (socketRef.current) {
      const messageData = {
        chat_id: chatId,
        sender_id: currentUserId,
        message_text: message,
      };

      socketRef.current.emit("send_message", messageData);

      // إضافة الرسالة محلياً (سيتم تحديثها عند استقبال الرسالة من الخادم)
      const localMessage = {
        message_id: Date.now(), // معرف مؤقت
        chat_id: chatId,
        sender_id: currentUserId,
        message_text: message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, localMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (date) => {
    return format(new Date(date), "h:mm a", { locale: arEG });
  };

  // تنسيق تاريخ الرسالة
  // // const formatMessageDate = (date) => {
  // //   const now = new Date();
  // //   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // //   const yesterday = new Date(today);
  // //   yesterday.setDate(yesterday.getDate() - 1);
  // //   const messageDate = new Date(date);

  // //   if (messageDate >= today) {
  // //     return "اليوم";
  // //   } else if (messageDate >= yesterday) {
  // //     return "الأمس";
  // //   } else {
  // //     return format(messageDate, "EEEE d MMMM", { locale: arEG });
  // //   }
  // // };

  // // تجميع الرسائل حسب التاريخ
  // const groupMessagesByDate = () => {
  //   const groups = {};
  //   messages.forEach((message) => {
  //     const date = new Date(message.timestamp);
  //     const dateString = format(date, "yyyy-MM-dd");
  //     if (!groups[dateString]) {
  //       groups[dateString] = [];
  //     }
  //     groups[dateString].push(message);
  //   });
  //   return groups;
  // };

  // تنسيق الرسائل لتكون جاهزة للعرض
  // const messageGroups = groupMessagesByDate();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          جاري تحميل المحادثة...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button component={Link} to="/messages" variant="contained">
          العودة للرسائل
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper
        sx={{
          height: "calc(100vh - 200px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Chat Header */}
        {isMobile ? (
          <AppBar position="static" color="default" elevation={0}>
            <Toolbar>
              <IconButton edge="start" component={Link} to="/messages">
                <ArrowBackIcon />
              </IconButton>
              <Avatar sx={{ mx: 1 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {chatData?.user_1_name || "المستخدم"}
                </Typography>
              </Box>
              <IconButton>
                <PhoneIcon />
              </IconButton>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        ) : (
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button
              component={Link}
              to="/messages"
              startIcon={<ArrowBackIcon />}
              sx={{ mr: 2 }}
            >
              العودة للرسائل
            </Button>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              variant="dot"
              color="success"
            >
              <Avatar />
            </Badge>
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {chatData?.user_1_name || "المستخدم"}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton>
              <InfoIcon />
            </IconButton>
          </Box>
        )}

        {/* Messages Area */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.default",
          }}
        >
          <Box>
            {/* تاريخ الرسايل
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <Chip
                  label={formatMessageDate(new Date(msg.timestamp))}
                  size="small"
                />
              </Box> */}
            {masseges[0].map((msg) => (
              <Box
                key={msg.message_id}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender_id === currentUserId ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                {msg.sender_id !== currentUserId && (
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1,
                      mt: 0.5,
                      display: { xs: "none", sm: "block" },
                    }}
                  />
                )}
                <Box
                  sx={{
                    maxWidth: "70%",
                    bgcolor:
                      msg.sender_id === currentUserId
                        ? "primary.main"
                        : "background.paper",
                    color:
                      msg.sender_id === currentUserId
                        ? "white"
                        : "text.primary",
                    borderRadius: 2,
                    p: 2,
                    boxShadow: 1,
                    position: "relative",
                  }}
                >
                  <Typography variant="body1">{msg.message_text}</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      mt: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color={
                        msg.sender_id === currentUserId
                          ? "rgba(255,255,255,0.7)"
                          : "text.secondary"
                      }
                    >
                      {formatMessageTime(msg.timestamp)}
                    </Typography>
                    {msg.sender_id === currentUserId && (
                      <Box
                        component="span"
                        sx={{
                          ml: 0.5,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            bgcolor: "success.main",
                            display: "inline-block",
                            ml: 0.5,
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
          <div ref={messagesEndRef} />
        </Box>

        {/* Message Input */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              fullWidth
              placeholder="اكتب رسالتك هنا..."
              variant="outlined"
              size="small"
              multiline
              maxRows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{ mx: 1 }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={message.trim() === ""}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatPage;
