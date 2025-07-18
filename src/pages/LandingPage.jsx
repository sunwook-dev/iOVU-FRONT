import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Grid,
  Paper,
  Container,
} from "@mui/material";
import { AiOutlineArrowRight } from "react-icons/ai";
import { keyframes } from "@emotion/react";

const LandingPage = () => {
  const cardData = [
    {
      id: 1,
      title: "관련 브랜드 랭킹",
      content: "/landingpage/brand.png",
      type: "image",
    },
    {
      id: 2,
      title: "브랜드 감정 평가",
      content: "/landingpage/emotion.png",
      type: "image",
    },
    {
      id: 3,
      title: "AI 검색량 추이",
      content: "/landingpage/ai.png",
      type: "image",
    },
    {
      id: 4,
      title: "Link Tracking",
      content: "/landingpage/linkList.png",
      type: "image",
    },
  ];

  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };

  // 마키 애니메이션 keyframes
  const marquee = keyframes`
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  `;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fff",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      {/* 상단바 */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 1300,
          mx: "auto",
          pt: 4,
          px: 0,
          display: "flex",
          alignItems: "center",
          minHeight: 80,
          mb: 8,
        }}
      >
        {/* 로고 */}
        <Typography
          variant="h4"
          fontWeight={700}
          color="#000"
          sx={{ letterSpacing: 1, fontSize: 32, minWidth: 120, mr: 8 }}
        >
          iOVU
        </Typography>
        {/* 중앙 아바타 */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Avatar
            src="/image/iOVU_logo.png"
            sx={{ width: 40, height: 40, bgcolor: "#fff" }}
          />
        </Box>
        {/* 로그인 버튼 */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              bgcolor: "#000",
              color: "#fff",
              px: 4,
              py: 1,
              boxShadow: "none",
              fontSize: 16,
              minWidth: 110,
              minHeight: 38,
              ml: 8,
              "&:hover": { bgcolor: "#222" },
            }}
          >
            Login
          </Button>
        </Box>
      </Box>

      {/* 메인 컨텐츠 */}
      <Container
        maxWidth={false}
        disableGutters
        sx={{ maxWidth: 1200, mx: "auto", mt: 2, mb: 0 }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 4,
            minHeight: 340,
            my: 6,
          }}
        >
          {/* 왼쪽 텍스트/버튼 중앙 정렬 */}
          <Box
            sx={{
              flex: 1,
              minWidth: 340,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: 320,
            }}
          >
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                lineHeight: 1.18,
                fontSize: 36,
                color: "#111",
                mb: 4,
                textAlign: "center",
                width: "100%",
              }}
            >
              당신의 브랜드
              <br />
              AI 세상에서 어떻게 보일까?
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1.5px solid #bfc8db",
                  borderRadius: 999,
                  px: 3,
                  py: 1.2,
                  width: "fit-content",
                  minWidth: 370,
                  height: 54,
                  boxSizing: "border-box",
                  gap: 2,
                  bgcolor: "#fff",
                  boxShadow: "0 2px 8px 0 rgba(33, 150, 243, 0.04)",
                }}
              >
                <Typography
                  sx={{
                    color: "#0a2a8b",
                    fontWeight: 800,
                    fontSize: 21,
                    flex: 1,
                    ml: 1,
                    letterSpacing: -0.5,
                  }}
                >
                  미국 브랜드 칼하트!
                </Typography>
                <Box
                  sx={{
                    bgcolor: "#111",
                    color: "#fff",
                    borderRadius: 999,
                    px: 2.7,
                    py: 0.8,
                    fontWeight: 500,
                    fontSize: 15,
                    minWidth: 120,
                    textAlign: "center",
                    mr: 0.5,
                    boxShadow: "0 1px 4px 0 rgba(0,0,0,0.10)",
                  }}
                >
                  AI 인사이트 보기
                </Box>
              </Box>
            </Box>
          </Box>
          {/* 오른쪽 스냅샷 카드 - 큰 배경 박스 */}
          <Box
            sx={{
              flex: 1,
              minWidth: 380,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              height: 340,
            }}
          >
            <Box
              sx={{
                bgcolor: "#f6f8fe",
                borderRadius: 6,
                p: 3.5,
                display: "flex",
                alignItems: "center",
                boxShadow: "0 2px 16px 0 rgba(33, 150, 243, 0.08)",
                minWidth: 420,
                minHeight: 220,
                border: "2.5px solid #e3e8f7",
                gap: 4,
              }}
            >
              {/* 왼쪽 로고+텍스트 */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mr: 2,
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: 3,
                    boxShadow: "0 2px 8px 0 rgba(33, 150, 243, 0.10)",
                    p: 2,
                    mb: 1,
                  }}
                >
                  <img
                    src="/image/iOVU_logo.png"
                    alt="carhartt"
                    style={{ width: 54, height: 54, display: "block" }}
                  />
                </Box>
                <Typography
                  fontWeight={900}
                  fontSize={18}
                  color="#111"
                  sx={{ mb: 0.2, letterSpacing: -0.5, textAlign: "center" }}
                >
                  Carhartt
                </Typography>
                <Typography
                  fontSize={14}
                  color="#888"
                  fontWeight={600}
                  sx={{ textAlign: "center" }}
                >
                  Brand Snapshot
                </Typography>
              </Box>
              {/* 오른쪽 실제 카드 */}
              <Box
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 7,
                  boxShadow: "0 8px 32px 0 rgba(33, 150, 243, 0.13)",
                  p: 2.7,
                  minWidth: 370,
                  minHeight: 210,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  position: "relative",
                }}
              >
                {/* 상단 */}
                <Typography
                  sx={{
                    color: "#bfc3d4",
                    fontSize: 13,
                    fontWeight: 700,
                    mb: 0.3,
                    textTransform: "lowercase",
                    letterSpacing: 0.5,
                  }}
                >
                  carhartt
                </Typography>
                <Typography
                  sx={{
                    color: "#23254a",
                    fontSize: 17,
                    fontWeight: 900,
                    mb: 1.2,
                    lineHeight: 1.2,
                  }}
                >
                  브랜드 감정 평가 트래킹
                </Typography>
                <Box
                  sx={{ width: "100%", height: 1, bgcolor: "#ececf3", mb: 1.2 }}
                />
                {/* 감정 바 */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.3,
                    width: "100%",
                    mb: 1.2,
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "32px",
                        height: "20px",
                        bgcolor: "#ffd6df",
                        borderRadius: 2,
                        mb: 0.5,
                      }}
                    />
                    <Typography
                      sx={{
                        color: "#7b7ba8",
                        fontWeight: 700,
                        fontSize: 12,
                        mt: 0.2,
                      }}
                    >
                      Negative
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.3,
                        mt: 0.2,
                      }}
                    >
                      <span style={{ fontSize: 13, color: "#ff4d6d" }}>☹️</span>
                      <Typography
                        sx={{ color: "#ff4d6d", fontWeight: 700, fontSize: 13 }}
                      >
                        16
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "46px",
                        height: "20px",
                        bgcolor: "#ffe3b3",
                        borderRadius: 2,
                        mb: 0.5,
                      }}
                    />
                    <Typography
                      sx={{
                        color: "#7b7ba8",
                        fontWeight: 700,
                        fontSize: 12,
                        mt: 0.2,
                      }}
                    >
                      Neutral
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.3,
                        mt: 0.2,
                      }}
                    >
                      <span style={{ fontSize: 13, color: "#ffb300" }}>😐</span>
                      <Typography
                        sx={{ color: "#ffb300", fontWeight: 700, fontSize: 13 }}
                      >
                        45
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      flex: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "93px",
                        height: "20px",
                        bgcolor: "#c8f7d8",
                        borderRadius: 2,
                        mb: 0.5,
                      }}
                    />
                    <Typography
                      sx={{
                        color: "#7b7ba8",
                        fontWeight: 700,
                        fontSize: 12,
                        mt: 0.2,
                      }}
                    >
                      Positive
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.3,
                        mt: 0.2,
                      }}
                    >
                      <span style={{ fontSize: 13, color: "#00c853" }}>😊</span>
                      <Typography
                        sx={{ color: "#00c853", fontWeight: 700, fontSize: 13 }}
                      >
                        2,113
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{ width: "100%", height: 1, bgcolor: "#ececf3", mb: 1.2 }}
                />
                {/* 하단 */}
                <Typography
                  sx={{
                    color: "#bfc3d4",
                    fontSize: 11,
                    fontWeight: 700,
                    mb: 0.3,
                    textTransform: "lowercase",
                    letterSpacing: 0.5,
                  }}
                >
                  carhartt
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    mb: 0.7,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#23254a",
                      fontSize: 14,
                      fontWeight: 900,
                      flex: 1,
                    }}
                  >
                    AI 검색량 증가
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: "#1976d2",
                      color: "#fff",
                      borderRadius: 2,
                      px: 1,
                      py: 0.2,
                      fontWeight: 700,
                      fontSize: 10,
                      ml: 1,
                      minWidth: 36,
                      textAlign: "center",
                      boxShadow: "0 2px 8px 0 rgba(33, 150, 243, 0.10)",
                    }}
                  >
                    + 34%
                  </Box>
                </Box>
                {/* 그래프 */}
                <Box
                  sx={{
                    width: "100%",
                    height: 36,
                    position: "relative",
                    mt: 0.5,
                  }}
                >
                  <svg
                    width="100%"
                    height="36"
                    viewBox="0 0 320 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <filter id="shadow" x="0" y="0" width="320" height="36">
                        <feDropShadow
                          dx="0"
                          dy="2.5"
                          stdDeviation="2.5"
                          flood-color="#1976d2"
                          flood-opacity="0.10"
                        />
                      </filter>
                    </defs>
                    <path
                      d="M0 32 Q40 24 80 30 T160 22 T240 28 T320 14"
                      stroke="#1976d2"
                      strokeWidth="2"
                      fill="none"
                      filter="url(#shadow)"
                    />
                  </svg>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* 카드형 4개 영역 */}
        <Box
          sx={{
            my: 10,
            backgroundColor: "#F2F1FF",
            py: 4,
            overflow: "hidden",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "max-content",
              animation: `${marquee} 60s linear infinite`,
            }}
          >
            {[...cardData, ...cardData].map((card, idx) => (
              <Box key={idx} sx={{ minWidth: 260, maxWidth: 300, mx: 2 }}>
                <Paper
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    height: 200,
                    boxShadow: "0 2px 12px 0 rgba(33, 150, 243, 0.06)",
                  }}
                >
                  <Typography fontWeight={700} fontSize={15} sx={{ mb: 1 }}>
                    {card.title}
                  </Typography>
                  <Box
                    sx={{
                      height: 120,
                      // bgcolor: "#e3f2fd",
                      borderRadius: 2,
                      my: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#666",
                    }}
                  >
                    {card.type === "image" ? (
                      <img
                        src={card.content}
                        alt={card.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          borderRadius: "8px",
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: "#666", textAlign: "center" }}>
                        {card.content}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>

        {/* 메인 설명 */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{ mb: 2, textAlign: "center" }}
          >
            내 브랜드, 과연 <span style={{ color: "#1976d2" }}>GPT</span> 눈엔
            어떻게 보일까
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              color: "#444",
              fontSize: 24,
              mb: 4,
              mt: 2,
              fontWeight: 500,
            }}
          >
            AI가 당신의 브랜드를 충분히 보여 주고 있는지,
            <br />
            경쟁사를 더 높게 평가하고 있지는 않은지 지금 바로 확인해 보세요.
          </Typography>
        </Box>

        {/* 설명 카드 */}
        <Box
          sx={{
            bgcolor: "#e3e8f7",
            borderRadius: 6,
            p: 4,
            mb: 8,
            maxWidth: 900,
            mx: "auto",
            py: 6,
          }}
        >
          <Typography
            sx={{ color: "#222", fontSize: 18, mb: 2, textAlign: "center" }}
          >
            iOVU는 마케팅 팀과 D2C 브랜드 운영자를 위해 설계된 프롬프트 기반
            <br />
            생성형 AI 검색 모니터링 SaaS 플랫폼입니다.
          </Typography>
          <Typography
            sx={{ color: "#222", fontSize: 18, mb: 2, textAlign: "center" }}
          >
            AI 분석 기술을 통해 ChatGPT, Google SGE, Perplexity 등<br />
            주요 생성형 AI 검색 결과에서 브랜드 노출 현황과 경쟁 순위를
            추적하고,
            <br />
            정교한 감성 분석으로 브랜드 평판을 진단합니다.
          </Typography>
          <Typography sx={{ color: "#222", fontSize: 18, textAlign: "center" }}>
            또한, 축적된 AI 인사이트를 바탕으로 실행 가능한 전략 컨설팅까지
            제공합니다.
            <br />
            이를 통해 기업은 AI 검색 시대에 브랜드 가치성을 최적화하고 경쟁
            우위를 확보할 수 있습니다.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
