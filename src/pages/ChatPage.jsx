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
  Tooltip,
  Snackbar,
} from "@mui/material";
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Info as InfoIcon,
  Flag as FlagIcon,
} from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { arEG, is } from "date-fns/locale";
import { fetchChatMessages, fetchChatById } from "../api/chatApi";
import io from "socket.io-client";
import { getUserID, getUserRole } from "../utils/checkUser.js";
import ReportDialog from "../components/ReportDialog";

const ChatPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { id: chatId } = useParams();
  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportEntityId, setReportEntityId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const currentUserId = getUserID();
  const getRole = getUserRole();

  // إعداد اتصال Socket.io
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    if (chatId) {
      socketRef.current.emit("join_chat", chatId);
    }

    socketRef.current.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [chatId]);

  // جلب بيانات المحادثة والرسائل
  useEffect(() => {
    const fetchChatData = async () => {
      if (!chatId) return;

      setLoading(true);
      try {
        const response = await fetchChatById(chatId);
        const messagesResponse = await fetchChatMessages(chatId);
        if (response.status === "success") {
          setMessages(messagesResponse.data || []);

          if (response.data) {
            const firstMessage = response.data;
            setChatData({
              chat_id: firstMessage.chat_id,
              user_id_1: firstMessage.user_id_1,
              user_id_2: firstMessage.user_id_2,
              user_1_name: firstMessage.other_user_name,
            });
          }
        } else {
          setError("حدث خطأ أثناء جلب الرسائل");
        }
      } catch (err) {
        setError(`حدث خطأ: ${err?.response?.data?.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [chatId, currentUserId]);

  // التمرير إلى آخر رسالة عند تحديث الرسائل
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (message.trim() === "" || !chatId) return;

    if (socketRef.current) {
      const messageData = {
        chat_id: chatId,
        sender_id: currentUserId,
        message_text: message,
      };

      socketRef.current.emit("send_message", messageData);

      const localMessage = {
        message_id: Date.now(),
        chat_id: chatId,
        sender_id: currentUserId,
        message_text: message,
        timestamp: new Date().toISOString(),
        sender_name: "أنت",
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

  const formatMessageDate = (date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const messageDate = new Date(date);

    if (messageDate >= today) {
      return "اليوم";
    } else if (messageDate >= yesterday) {
      return "الأمس";
    } else {
      return format(messageDate, "EEEE d MMMM", { locale: arEG });
    }
  };

  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach((message) => {
      const date = new Date(message.timestamp);
      const dateString = format(date, "yyyy-MM-dd");
      if (!groups[dateString]) {
        groups[dateString] = [];
      }
      groups[dateString].push(message);
    });
    return groups;
  };

  const handleOpenReportDialog = (messageId) => {
    setReportEntityId(messageId);
    setReportDialogOpen(true);
  };

  const handleCloseReportDialog = (success) => {
    setReportDialogOpen(false);
    if (success) {
      setSnackbarMessage("تم تقديم البلاغ بنجاح");
      setOpenSnackbar(true);
    }
  };

  const messageGroups = groupMessagesByDate();

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
          {Object.keys(messageGroups).map((date) => (
            <Box key={date}>
              <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <Chip label={formatMessageDate(new Date(date))} size="small" />
              </Box>
              {messageGroups[date].map((msg) => {
                const isUser1 = msg.sender_id === chatData?.user_id_1;
                const isUser2 = msg.sender_id === chatData?.user_id_2;
                const isParticipant =
                  currentUserId === chatData?.user_id_1 ||
                  currentUserId === chatData?.user_id_2;
                const isCurrentUser = msg.sender_id === currentUserId;

                let bgcolor;
                let color;
                let justifyContent;

                if (isParticipant) {
                  // Current user is a participant in the chat
                  bgcolor = isCurrentUser ? "#000000" : "#f5f5f5";
                  color = isCurrentUser ? "white" : "black"; // White text for both to ensure readability
                  justifyContent = isCurrentUser ? "flex-end" : "flex-start";
                } else {
                  // Current user is not a participant (e.g., admin)
                  bgcolor = isUser1 ? "#000000" : "#f5f5f5"; // Black for user_id_1, gray for user_id_2
                  color = isUser1 ? "white" : "text.primary";
                  justifyContent = isUser1 ? "flex-end" : "flex-start";
                }

                return (
                  <Box
                    key={msg.message_id}
                    sx={{
                      display: "flex",
                      justifyContent,
                      mb: 2,
                    }}
                  >
                    {((isParticipant && !isCurrentUser) ||
                      (!isParticipant && isUser2)) && (
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
                        bgcolor,
                        color,
                        borderRadius: 2,
                        p: 2,
                        boxShadow: 1,
                        position: "relative",
                      }}
                    >
                      {getRole === "admin" && (
                        <Typography
                          variant="caption"
                          color={
                            color === "white"
                              ? "rgba(255,255,255,0.7)"
                              : "text.secondary"
                          }
                        >
                          {isUser1
                            ? chatData?.user_1_name || "User 1"
                            : "User 2"}
                        </Typography>
                      )}
                      <Typography variant="body1">
                        {msg.message_text}
                      </Typography>
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
                            color === "white"
                              ? "rgba(255,255,255,0.7)"
                              : "text.secondary"
                          }
                        >
                          {formatMessageTime(msg.timestamp)}
                        </Typography>
                        {(isCurrentUser || (!isParticipant && isUser1)) && (
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

                    {isParticipant && msg.sender_id !== currentUserId && (
                      <Tooltip title="الإبلاغ عن هذه الرسالة" arrow>
                        <IconButton
                          size="small"
                          color="error"
                          sx={{ ml: 1, alignSelf: "center" }}
                          onClick={() => handleOpenReportDialog(msg.message_id)}
                        >
                          <FlagIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                );
              })}
              <div ref={messagesEndRef} />
            </Box>
          ))}
        </Box>

        {(chatData?.user_id_1 === currentUserId ||
          chatData?.user_id_2 === currentUserId) && (
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
        )}
      </Paper>

      <ReportDialog
        open={reportDialogOpen}
        onClose={handleCloseReportDialog}
        entityType="message"
        entityId={reportEntityId}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      />
    </Container>
  );
};

export default ChatPage;
