import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Avatar,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Button,
  Divider,
  Chip,
  LinearProgress,
} from "@mui/material";
import { IoMdSend } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { AiOutlineCheck } from "react-icons/ai";
import { HiDocumentReport } from "react-icons/hi";
import { useSidebar } from "../contexts/SidebarContext";

const MY_AVATAR = "/static/images/avatar/1.jpg";
const IOVU_AVATAR = "/static/images/avatar/2.jpg";

const Chat = () => {
  const messagesEndRef = useRef(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "AI Assistant",
      avatar: IOVU_AVATAR,
      text: "안녕하세요! 무엇을 도와드릴까요?",
      time: "10:30",
      mine: false,
    },
  ]);

  // 리포트 관련 상태들
  const [showReport, setShowReport] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Context에서 실제 사이드바 상태 가져오기
  const { isSidebarOpen } = useSidebar();

  const SIDEBAR_WIDTH = 280;
  const COLLAPSED_SIDEBAR_WIDTH = 80;

  // LLM이 자동으로 리포트 생성할지 판단
  const shouldAutoGenerateReport = (currentMessages) => {
    const messageCount = currentMessages.length;
    const lastUserMessage = currentMessages[currentMessages.length - 1];

    // 1. 사용자가 명시적으로 분석 요청한 경우
    if (
      lastUserMessage &&
      (lastUserMessage.text.includes("분석") ||
        lastUserMessage.text.includes("요약") ||
        lastUserMessage.text.includes("정리") ||
        lastUserMessage.text.includes("보고서") ||
        lastUserMessage.text.includes("리포트"))
    ) {
      return true;
    }

    // 2. LLM이 충분한 정보가 모였다고 판단하는 경우들

    // 메시지가 8개 이상이고 다양한 주제가 논의된 경우
    if (messageCount >= 8) {
      return true;
    }

    // 메시지가 6개 이상이고 사용자의 질문이 복잡하거나 심화된 경우
    if (messageCount >= 6) {
      const recentUserMessages = currentMessages
        .filter((msg) => msg.mine)
        .slice(-3)
        .map((msg) => msg.text);

      // 질문의 복잡도나 길이로 판단
      const hasComplexQuestions = recentUserMessages.some(
        (text) =>
          text.length > 50 ||
          text.includes("어떻게") ||
          text.includes("왜") ||
          text.includes("방법") ||
          text.includes("차이") ||
          text.includes("비교")
      );

      if (hasComplexQuestions) {
        return true;
      }
    }

    // 3. 특정 패턴의 대화가 지속된 경우 (예: 문제 해결, 학습, 상담 등)
    if (messageCount >= 5) {
      const conversationText = currentMessages
        .slice(-4)
        .map((msg) => msg.text)
        .join(" ");

      // 문제 해결 패턴
      const isProblemSolving =
        conversationText.includes("문제") ||
        conversationText.includes("해결") ||
        conversationText.includes("오류") ||
        conversationText.includes("안됨");

      // 학습/교육 패턴
      const isLearning =
        conversationText.includes("배우") ||
        conversationText.includes("공부") ||
        conversationText.includes("이해") ||
        conversationText.includes("설명");

      // 계획/전략 패턴
      const isPlanning =
        conversationText.includes("계획") ||
        conversationText.includes("전략") ||
        conversationText.includes("방향") ||
        conversationText.includes("목표");

      if (isProblemSolving || isLearning || isPlanning) {
        return true;
      }
    }

    return false;
  };

  // 리포트 생성 트리거 키워드들
  const reportTriggerKeywords = [
    "보고서를 생성하겠습니다",
    "리포트를 만들어드리겠습니다",
    "분석 결과를 정리해드리겠습니다",
    "요약 보고서를 작성하겠습니다",
    "대화 분석을 시작하겠습니다",
  ];

  // 메시지에서 리포트 생성 키워드 감지
  const detectReportTrigger = (messageText) => {
    return reportTriggerKeywords.some((keyword) =>
      messageText.includes(keyword)
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      user: "나",
      avatar: MY_AVATAR,
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      mine: true,
    };
    setMessages([...messages, newMessage]);
    setInput("");

    // AI 응답 시뮬레이션 (실제로는 LLM API 호출)
    setTimeout(() => {
      simulateAIResponse([...messages, newMessage]);
    }, 1000);
  };

  // AI 응답 시뮬레이션 함수
  const simulateAIResponse = (currentMessages) => {
    // 사용자가 특정 질문을 했을 때 보고서 생성 제안
    const lastUserMessage = currentMessages[currentMessages.length - 1];
    const userText = lastUserMessage.text.toLowerCase();

    let aiResponse = "";
    let shouldGenerateReport = false;

    if (
      userText.includes("요약") ||
      userText.includes("정리") ||
      userText.includes("분석")
    ) {
      aiResponse = "네, 지금까지의 대화를 분석해서 보고서를 생성하겠습니다. 📊";
      shouldGenerateReport = true;
    } else if (userText.includes("보고서") || userText.includes("리포트")) {
      aiResponse =
        "말씀하신 대로 대화 내용을 바탕으로 리포트를 만들어드리겠습니다! 🔍";
      shouldGenerateReport = true;
    } else if (currentMessages.length >= 8) {
      // LLM이 충분한 대화량을 감지했을 때 자동으로 분석 제안
      aiResponse =
        "대화가 활발하게 진행되고 있네요! 지금까지의 내용을 종합해서 인사이트를 도출해보겠습니다. 📈";
      shouldGenerateReport = true;
    } else if (currentMessages.length >= 6) {
      // 중간 단계에서 패턴 감지
      const recentText = currentMessages
        .slice(-3)
        .map((msg) => msg.text)
        .join(" ");
      if (
        recentText.includes("문제") ||
        recentText.includes("해결") ||
        recentText.includes("방법")
      ) {
        aiResponse =
          "문제 해결 과정에서 유용한 패턴들이 보이네요. 이를 바탕으로 분석 리포트를 생성해보겠습니다! 🔍";
        shouldGenerateReport = true;
      }
    } else {
      // 일반적인 AI 응답들
      const responses = [
        "이해했습니다! 더 자세히 설명해주시겠어요?",
        "좋은 질문이네요. 추가로 궁금한 점이 있으신가요?",
        "네, 맞습니다. 다른 관련 사항도 확인해보시겠어요?",
        "흥미로운 관점이네요! 더 논의해볼까요?",
        "도움이 되셨다면 다행입니다. 다른 질문도 언제든 해주세요!",
      ];
      aiResponse = responses[Math.floor(Math.random() * responses.length)];
    }

    const aiMessage = {
      id: currentMessages.length + 1,
      user: "AI Assistant",
      avatar: IOVU_AVATAR,
      text: aiResponse,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      mine: false,
    };

    setMessages((prev) => [...prev, aiMessage]);

    // LLM이 충분한 정보가 모였다고 판단하면 자동으로 리포트 생성
    if (shouldAutoGenerateReport([...messages, aiMessage])) {
      setTimeout(() => {
        if (!reportData) {
          autoGenerateReport([...messages, aiMessage]);
        }
      }, 1500);
    }
  };

  // LLM이 자동으로 리포트 생성
  const autoGenerateReport = (currentMessages) => {
    setIsGeneratingReport(true);

    // 실제로는 여기서 LLM API를 호출해서 대화 내용을 분석
    // 예: await analyzeConversation(currentMessages)

    setTimeout(() => {
      const generatedData = {
        messageCount: currentMessages.length,
        duration: `${Math.floor(currentMessages.length / 2)}분`,
        sentiment: currentMessages.length > 3 ? "긍정적" : "중립적",
        summary:
          currentMessages.length > 3
            ? "활발한 대화가 진행되었으며 다양한 주제에 대해 논의했습니다"
            : "대화가 시작되었습니다",
        keyPoints:
          currentMessages.length > 3
            ? [
                "사용자와 AI 간의 원활한 소통",
                "다양한 주제에 대한 질문과 답변",
                "전반적으로 긍정적인 대화 분위기",
                "추가적인 정보 요청이 활발함",
              ]
            : [
                "대화 초기 단계",
                "기본적인 인사와 질문",
                "대화가 시작되었습니다",
              ],
      };

      setReportData(generatedData);
      setIsGeneratingReport(false);
      // 리포트가 생성되면 자동으로 사이드바 열기
      setShowReport(true);
    }, 3000);
  };

  // 토글 버튼으로 리포트 열고 닫기
  const toggleReport = () => {
    setShowReport(!showReport);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxWidth={false} sx={{ height: "100vh", p: 0 }}>
      <Box sx={{ display: "flex", height: "100%" }}>
        {/* 채팅 영역 */}
        <Box
          sx={{
            width: {
              xs: showReport ? "calc(100% - 350px)" : "100%", // 모바일: 고정 너비
              sm: showReport ? "calc(100% - 400px)" : "100%", // 태블릿: 고정 너비
              md: showReport ? "50%" : "100%", // 데스크톱 이상: 50% 분할
            },
            transition: "width 0.3s ease",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* 헤더 */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid #e0e0e0",
              bgcolor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* 헤더 - 기존 내용 제거하고 심플하게 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar src={IOVU_AVATAR} sx={{ width: 40, height: 40 }} />
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "16px", fontWeight: 600 }}
                >
                  AI Assistant
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#4caf50",
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    온라인
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* 리포트 생성 중 표시 */}
          {isGeneratingReport && (
            <Box sx={{ px: 3, py: 1 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
              >
                <Typography variant="body2" color="primary">
                  🤖 AI가 대화를 분석하고 있습니다...
                </Typography>
                <Chip label="AI 분석중" size="small" color="primary" />
              </Box>
              <LinearProgress />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                대화 내용을 종합하여 인사이트를 도출하고 있어요
              </Typography>
            </Box>
          )}

          {/* 메시지 영역 */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: 2,
              bgcolor: "#f8f9fa",
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent: message.mine ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: message.mine ? "row-reverse" : "row",
                    alignItems: "flex-start",
                    gap: 1,
                    maxWidth: "70%",
                  }}
                >
                  <Avatar
                    src={message.avatar}
                    sx={{ width: 32, height: 32, mt: 1 }}
                  />
                  <Paper
                    sx={{
                      px: 2,
                      py: 1.5,
                      bgcolor: message.mine ? "#1976d2" : "#fff",
                      color: message.mine ? "#fff" : "#000",
                      borderRadius: message.mine
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                      boxShadow: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "14px", lineHeight: 1.4 }}
                    >
                      {message.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 0.5,
                        opacity: 0.7,
                        fontSize: "11px",
                      }}
                    >
                      {message.time}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* 입력 영역 */}
          <Box sx={{ p: 2, bgcolor: "#fff", borderTop: "1px solid #e0e0e0" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="메시지를 입력하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              multiline
              maxRows={4}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSend} disabled={!input.trim()}>
                      <IoMdSend />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        </Box>

        {/* 고정 토글 버튼 - 반응형 수정 */}
        <Box
          sx={{
            position: "fixed",
            left: showReport
              ? {
                  xs: isSidebarOpen // 모바일
                    ? `calc((100vw - 350px) + ${SIDEBAR_WIDTH / 2}px - 24px)`
                    : `calc((100vw - 350px) + ${
                        COLLAPSED_SIDEBAR_WIDTH / 2
                      }px - 24px)`,
                  sm: isSidebarOpen // 태블릿
                    ? `calc((100vw - 400px) + ${SIDEBAR_WIDTH / 2}px - 24px)`
                    : `calc((100vw - 400px) + ${
                        COLLAPSED_SIDEBAR_WIDTH / 2
                      }px - 24px)`,
                  md: isSidebarOpen // 데스크톱
                    ? `calc(50vw + ${SIDEBAR_WIDTH / 2}px - 24px)`
                    : `calc(50vw + ${COLLAPSED_SIDEBAR_WIDTH / 2}px - 24px)`,
                }
              : "auto",
            right: showReport ? "auto" : "8px",
            top: "50%",
            transform: "translateY(-50%)",
            transition: "all 0.3s ease",
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={toggleReport}
            sx={{
              width: 48,
              height: 48,
              bgcolor: "#F2F1FF",
              "&:hover": {
                boxShadow: 6,
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease",
            }}
          >
            {showReport ? "❯" : "❮"}
          </IconButton>

          {/* 리포트 생성 중일 때 로딩 표시 */}
          {isGeneratingReport && (
            <Box
              sx={{
                position: "absolute",
                top: "-50px",
                right: showReport ? "0" : "-20px",
                bgcolor: "rgba(25, 118, 210, 0.95)",
                color: "white",
                px: 2,
                py: 1,
                borderRadius: 2,
                fontSize: "12px",
                whiteSpace: "nowrap",
                boxShadow: 3,
                border: "1px solid rgba(255,255,255,0.3)",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: "6px solid rgba(25, 118, 210, 0.95)",
                },
              }}
            >
              🤖 AI 분석 중...
            </Box>
          )}

          {/* 새 리포트 알림 - 위치 조정 */}
          {reportData && !showReport && (
            <Box
              sx={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                width: 24,
                height: 24,
                bgcolor: "#ff4444",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                color: "white",
                fontWeight: "bold",
                border: "2px solid white",
                boxShadow: 2,
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { transform: "scale(1)", opacity: 1 },
                  "50%": { transform: "scale(1.2)", opacity: 0.8 },
                  "100%": { transform: "scale(1)", opacity: 1 },
                },
              }}
            >
              •
            </Box>
          )}
        </Box>
        {showReport && (
          <Box
            sx={{
              width: "50%",
              borderLeft: "1px solid #e0e0e0",
              bgcolor: "#f5f5f5",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* 리포트 헤더 */}
            <Box
              sx={{
                p: 2,
                bgcolor: "#fff",
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "16px", fontWeight: 600 }}
              >
                📊 대화 분석 리포트
              </Typography>
              <IconButton onClick={toggleReport} size="small">
                <IoMdClose />
              </IconButton>
            </Box>

            {/* 리포트 내용 */}
            <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
              {reportData && (
                <>
                  {/* 요약 섹션 */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: "#fff",
                      borderRadius: 2,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: "#1976d2", fontSize: "14px" }}
                    >
                      📊 대화 요약
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "12px", lineHeight: 1.4 }}
                    >
                      {reportData.summary}: 총 {reportData.messageCount}개의
                      메시지가 교환되었으며, 전반적으로 {reportData.sentiment}{" "}
                      분위기의 대화가 진행되었습니다.
                    </Typography>
                  </Paper>

                  {/* 차트 영역 - 시간별 메시지 분포 */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: "#fff",
                      borderRadius: 2,
                      border: "1px solid #e0e0e0",
                      height: "140px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 1, color: "#1976d2", fontSize: "14px" }}
                    >
                      시간별 대화량 +
                      {Math.floor((reportData.messageCount / 5) * 100)}%
                    </Typography>
                    <Box
                      sx={{
                        height: "80px",
                        bgcolor: "#f8f9ff",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "end",
                        justifyContent: "space-around",
                        p: 1,
                      }}
                    >
                      {/* 메시지 수에 따른 동적 차트 */}
                      {Array.from({ length: 5 }, (_, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: "12px",
                            height: `${Math.min(
                              ((reportData.messageCount * (index + 1)) / 5) * 8,
                              64
                            )}px`,
                            bgcolor: "#1976d2",
                            borderRadius: "2px 2px 0 0",
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>

                  {/* 키워드 랭킹 */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: "#fff",
                      borderRadius: 2,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: "#1976d2", fontSize: "14px" }}
                    >
                      주요 키워드 랭킹
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      {[
                        {
                          keyword: "AI",
                          count: reportData.messageCount * 20,
                          color: "#1976d2",
                        },
                        {
                          keyword: "도움",
                          count: reportData.messageCount * 15,
                          color: "#42a5f5",
                        },
                        {
                          keyword: "질문",
                          count: reportData.messageCount * 12,
                          color: "#64b5f6",
                        },
                        {
                          keyword: "정보",
                          count: reportData.messageCount * 8,
                          color: "#90caf9",
                        },
                      ].map((item, index) => (
                        <Box
                          key={index}
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ minWidth: "20px", fontSize: "10px" }}
                          >
                            {index + 1}
                          </Typography>
                          <Box
                            sx={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ minWidth: "60px", fontSize: "10px" }}
                            >
                              {item.keyword}
                            </Typography>
                            <Box
                              sx={{
                                flex: 1,
                                height: "8px",
                                bgcolor: "#f0f0f0",
                                borderRadius: "4px",
                                overflow: "hidden",
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${Math.min(
                                    (item.count /
                                      (reportData.messageCount * 20)) *
                                      100,
                                    100
                                  )}%`,
                                  height: "100%",
                                  bgcolor: item.color,
                                }}
                              />
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{ fontSize: "10px", color: "#666" }}
                            >
                              {item.count}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>

                  {/* 감정 분석 */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: "#fff",
                      borderRadius: 2,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: "#1976d2", fontSize: "14px" }}
                    >
                      감정 분석 결과
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      {[
                        {
                          label: "Positive",
                          value: reportData.sentiment === "긍정적" ? 70 : 40,
                          color: "#4caf50",
                        },
                        {
                          label: "Neutral",
                          value: reportData.sentiment === "긍정적" ? 25 : 55,
                          color: "#9e9e9e",
                        },
                        {
                          label: "Negative",
                          value: reportData.sentiment === "긍정적" ? 5 : 5,
                          color: "#f44336",
                        },
                      ].map((item, index) => (
                        <Box
                          key={index}
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontSize: "10px", minWidth: "50px" }}
                          >
                            {item.label}
                          </Typography>
                          <Box
                            sx={{
                              flex: 1,
                              height: "12px",
                              bgcolor: "#f0f0f0",
                              borderRadius: "6px",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                width: `${item.value}%`,
                                height: "100%",
                                bgcolor: item.color,
                              }}
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{ fontSize: "10px" }}
                          >
                            {item.value}%
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>

                  {/* 인사이트 분석 */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: "#fff",
                      borderRadius: 2,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: "#1976d2", fontSize: "14px" }}
                    >
                      🔍 주요 인사이트
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      {reportData.keyPoints.map((point, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "flex-start",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="primary"
                            sx={{ fontSize: "10px", mt: 0.2 }}
                          >
                            •
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ fontSize: "10px", lineHeight: 1.3 }}
                          >
                            {point}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>

                  <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ borderRadius: 2, px: 3, fontSize: "11px" }}
                      onClick={() => alert("상세 리포트를 다운로드합니다!")}
                    >
                      📄 상세 리포트 다운로드
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Chat;
