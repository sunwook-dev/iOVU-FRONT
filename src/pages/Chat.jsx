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
  CircularProgress,
} from "@mui/material";
import { IoMdSend } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { AiOutlineCheck } from "react-icons/ai";
import { HiDocumentReport } from "react-icons/hi";
import { useSidebar } from "../contexts/SidebarContext";

const MY_AVATAR = "/static/images/avatar/1.jpg";
const IOVU_AVATAR = "/static/images/avatar/2.jpg";
const FASTAPI_BASE_URL = "http://localhost:8000";

const Chat = () => {
  const messagesEndRef = useRef(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  // 리포트 관련 상태들
  const [showReport, setShowReport] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  // 챗봇 관련 상태들
  const [currentStep, setCurrentStep] = useState("brand_name_ko");
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [brandData, setBrandData] = useState(null);

  // Context에서 실제 사이드바 상태 가져오기
  const { isSidebarOpen } = useSidebar();

  const SIDEBAR_WIDTH = 280;
  const COLLAPSED_SIDEBAR_WIDTH = 80;

  // LLM이 자동으로 리포트 생성할지 판단 (브랜드 등록이 완료되면 리포트 생성)
  const shouldAutoGenerateReport = () => {
    return isComplete && brandData;
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

  useEffect(() => {
    startChatbot();
  }, []);

  // 브랜드 등록 완료 시 리포트 생성
  useEffect(() => {
    if (isComplete && brandData && !reportData) {
      autoGenerateReport();
    }
  }, [isComplete, brandData]);

  const startChatbot = async () => {
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/chatbot/start`);
      const data = await response.json();

      setMessages([
        {
          id: 1,
          user: "브랜드 등록 봇",
          avatar: IOVU_AVATAR,
          text: data.message,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          mine: false,
        },
      ]);
      setCurrentStep(data.step);
    } catch (error) {
      console.error("챗봇 시작 실패:", error);
      setMessages([
        {
          id: 1,
          user: "브랜드 등록 봇",
          avatar: IOVU_AVATAR,
          text: "죄송합니다. 서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          mine: false,
        },
      ]);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || isComplete) return; // isComplete 조건 추가

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

    setMessages((prev) => [...prev, newMessage]);

    const messageToSend = input;
    setInput(""); // 입력 필드를 먼저 비우고
    setIsLoading(true); // 그 다음에 로딩 상태 설정

    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          session_id: sessionId,
          step: currentStep,
        }),
      });

      const data = await response.json();

      const botMessage = {
        id: messages.length + 2,
        user: "브랜드 등록 봇",
        avatar: IOVU_AVATAR,
        text: data.message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        mine: false,
        data: data.data,
      };

      setMessages((prev) => [...prev, botMessage]);
      setCurrentStep(data.step);

      if (data.is_complete) {
        setIsComplete(true);
        setBrandData(data.data);
        // 자동 재시작 제거 - 완료 상태 유지
      }
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      const errorMessage = {
        id: messages.length + 2,
        user: "브랜드 등록 봇",
        avatar: IOVU_AVATAR,
        text: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        mine: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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

  // 브랜드 등록 완료 시 리포트 생성
  const autoGenerateReport = () => {
    if (!brandData) return;

    setIsGeneratingReport(true);

    setTimeout(() => {
      const generatedData = {
        title: "브랜드 등록 완료 리포트",
        createdAt: new Date().toLocaleString(),
        brandInfo: {
          nameKo: brandData.brand_name_ko,
          nameEn: brandData.brand_name_en,
          homepage: brandData.homepage_url,
          instagram: brandData.instagram_id,
          address: brandData.store_address,
        },
        summary: `${brandData.brand_name_ko} (${brandData.brand_name_en}) 브랜드가 성공적으로 등록되었습니다.`,
        keyPoints: [
          `브랜드명: ${brandData.brand_name_ko} (${brandData.brand_name_en})`,
          `홈페이지: ${brandData.homepage_url}`,
          `인스타그램: @${brandData.instagram_id}`,
          `매장 위치: ${brandData.store_address}`,
        ],
        recommendations: [
          "브랜드 정보가 모두 입력되었습니다.",
          "소셜미디어 마케팅을 통한 브랜드 홍보를 고려해보세요.",
          "고객 피드백 수집 시스템을 구축하는 것을 권장합니다.",
        ],
        status: "완료",
      };

      setReportData(generatedData);
      setIsGeneratingReport(false);
      setShowReport(true);
    }, 2000);
  };

  // 토글 버튼으로 리포트 열고 닫기
  const toggleReport = () => {
    setShowReport(!showReport);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isComplete) {
        // 완료 상태가 아닐 때만 전송
        handleSend();
      }
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
                  {isComplete ? "브랜드 등록 봇 (완료)" : "브랜드 등록 봇"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: isComplete ? "#ff9800" : "#4caf50",
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {isComplete ? "등록 완료" : "온라인"}
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
                      sx={{
                        fontSize: "14px",
                        lineHeight: 1.4,
                        whiteSpace: "pre-wrap", // 줄바꿈 지원
                      }}
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
              placeholder={
                isComplete
                  ? "브랜드 등록이 완료되었습니다. 새로 시작하려면 페이지를 새로고침하세요."
                  : "메시지를 입력하세요..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isComplete} // isLoading 조건 제거
              multiline
              maxRows={4}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleSend}
                      disabled={!input.trim() || isComplete} // isLoading 조건 제거
                      sx={{
                        color: !input.trim() || isComplete ? "#ccc" : "#1976d2",
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <IoMdSend />
                      )}
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
                🏢 {reportData?.title || "브랜드 등록 리포트"}
              </Typography>
              <IconButton onClick={toggleReport} size="small">
                <IoMdClose />
              </IconButton>
            </Box>

            {/* 리포트 내용 */}
            <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
              {reportData && (
                <>
                  {/* 등록 상태 표시 */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: "#e8f5e8",
                      borderRadius: 2,
                      border: "1px solid #4caf50",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AiOutlineCheck
                        style={{ color: "#4caf50", fontSize: "16px" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#2e7d32",
                        }}
                      >
                        등록 상태: {reportData.status}
                      </Typography>
                    </Box>
                  </Paper>

                  {/* 주요 인사이트 */}
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

                  {/* 생성중입니다 섹션 */}
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      mb: 2,
                      bgcolor:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: 3,
                      border: "2px solid #1976d2",
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
                      backdropFilter: "blur(4px)",
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                        animation: "shimmer 2s infinite",
                        "@keyframes shimmer": {
                          "0%": { left: "-100%" },
                          "100%": { left: "100%" },
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {/* 애니메이션 아이콘 */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          animation: "bounce 1.5s infinite",
                          "@keyframes bounce": {
                            "0%, 20%, 50%, 80%, 100%": {
                              transform: "translateY(0)",
                            },
                            "40%": { transform: "translateY(-10px)" },
                            "60%": { transform: "translateY(-5px)" },
                          },
                        }}
                      >
                        <Typography sx={{ fontSize: "24px" }}>🎨</Typography>
                        <Typography sx={{ fontSize: "24px" }}>✨</Typography>
                        <Typography sx={{ fontSize: "24px" }}>📊</Typography>
                      </Box>

                      {/* 메인 텍스트 */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "16px",
                          fontWeight: 700,
                          color: "#1976d2",
                          textAlign: "center",
                          background:
                            "linear-gradient(45deg, #1976d2, #42a5f5)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        상세 리포트 생성중입니다
                      </Typography>

                      {/* 서브 텍스트 */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "12px",
                          color: "#666",
                          textAlign: "center",
                          lineHeight: 1.4,
                        }}
                      >
                        브랜드 분석 데이터를 기반으로
                        <br />
                        맞춤형 인사이트를 준비하고 있어요
                        <br />
                        <span style={{ fontSize: "10px", color: "#999" }}>
                          ⏱️ 예상 소요시간: 약 5시간
                        </span>
                      </Typography>

                      {/* 진행률 바 */}
                      <Box sx={{ width: "100%", mt: 1 }}>
                        <Box
                          sx={{
                            width: "100%",
                            height: 8,
                            bgcolor: "rgba(25, 118, 210, 0.1)",
                            borderRadius: 4,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              height: "100%",
                              bgcolor: "#1976d2",
                              borderRadius: 4,
                              animation: "progress 3s ease-in-out infinite",
                              "@keyframes progress": {
                                "0%": { width: "20%" },
                                "50%": { width: "80%" },
                                "100%": { width: "20%" },
                              },
                            }}
                          />
                        </Box>
                      </Box>

                      {/* 점 애니메이션 */}
                      <Box sx={{ display: "flex", gap: 0.5, mt: 1 }}>
                        {[0, 1, 2].map((index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: "#1976d2",
                              animation: `dot ${1.5}s infinite`,
                              animationDelay: `${index * 0.2}s`,
                              "@keyframes dot": {
                                "0%, 80%, 100%": {
                                  transform: "scale(0.8)",
                                  opacity: 0.5,
                                },
                                "40%": {
                                  transform: "scale(1.2)",
                                  opacity: 1,
                                },
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Paper>
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
