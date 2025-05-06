"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { time } from "../utils/timeConverter.js";
import { fetchUserChats } from "../api/chatApi";
import { chat } from "../data/fakedata.js";

const MessagesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [conversations, setConversations] = useState(chat);

  // useEffect(() => {
  //   // جلب المحادثات من API
  //   const getChats = async () => {
  //     try {
  //       const response = await fetchUserChats();
  //       console.log("response", response.data);
  //       setConversations(response.data);
  //     } catch (error) {
  //       console.error("حدث خطأ:", error);
  //     }
  //   };

  //   getChats();
  // }, []);


  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        الرسائل
      </Typography>

      {conversations.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            لا توجد رسائل لعرضها
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            ابدأ محادثة جديدة من خلال صفحة المنتج أو الملف الشخصي للمستخدم
          </Typography>
        </Box>
      ) : (
        <Paper>
          <List sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}>
            {conversations.map((conversation, index) => (
              <Box key={conversation.id}>
                <ListItem
                  alignItems="flex-start"
                  component={Link}
                  to={`/chat/${conversation.chat_id}`}
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    py: 2,
                    px: 3,
                    transition: "background-color 0.2s",
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={"bold"}>
                          {conversation.other_user_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {time(conversation.last_message_timestamp)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color={"text.primary"}
                            fontWeight={"medium"}
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: isMobile ? "150px" : "250px",
                              display: "inline-block",
                            }}
                          >
                            {conversation.last_message}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < conversations.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </Box>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default MessagesPage;
