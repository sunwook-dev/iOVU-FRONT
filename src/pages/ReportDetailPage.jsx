import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ReportDetailPage = ({ reportId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const reportContentRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:8081/api/report/${reportId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setReport(data.report);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch report:", err);
        setLoading(false);
      });
  }, [reportId]);

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  const handleExportMD = async () => {
    if (!report || !report.reportContent) return;

    setLoading(true);
    handleExportClose();

    try {
      let markdownContent = report.reportContent;

      // 이미지 태그들을 찾아서 base64로 변환
      const imgElements = reportContentRef.current.querySelectorAll("img");

      const imagePromises = Array.from(imgElements).map(async (img) => {
        try {
          return new Promise((resolve) => {
            const tempImg = new Image();
            tempImg.crossOrigin = "anonymous";

            tempImg.onload = () => {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");

              canvas.width = tempImg.width;
              canvas.height = tempImg.height;
              ctx.drawImage(tempImg, 0, 0);

              const base64Data = canvas.toDataURL("image/png");

              // 마크다운에서 이미지 참조 방식을 base64로 교체
              const imgSrc = img.getAttribute("src");
              if (imgSrc) {
                // ![alt](src) 형태의 마크다운 이미지 문법 찾기
                const imgRegex = new RegExp(
                  `!\\[([^\\]]*)\\]\\(${imgSrc.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                  )}\\)`,
                  "g"
                );
                markdownContent = markdownContent.replace(
                  imgRegex,
                  `![$1](${base64Data})`
                );

                // <img> 태그 형태도 처리
                const htmlImgRegex = new RegExp(
                  `<img[^>]*src\\s*=\\s*["']${imgSrc.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                  )}["'][^>]*>`,
                  "g"
                );
                markdownContent = markdownContent.replace(
                  htmlImgRegex,
                  (match) => {
                    // alt 속성 추출
                    const altMatch = match.match(/alt\s*=\s*["']([^"']*)["']/);
                    const alt = altMatch ? altMatch[1] : "";
                    return `![${alt}](${base64Data})`;
                  }
                );
              }

              canvas.remove();
              resolve();
            };

            tempImg.onerror = () => {
              console.warn("이미지 로드 실패:", img.src);
              resolve(); // 실패해도 계속 진행
            };

            tempImg.src = img.src;
          });
        } catch (error) {
          console.warn("이미지 처리 중 오류:", error);
          return Promise.resolve();
        }
      });

      // 모든 이미지 처리 완료까지 대기
      await Promise.all(imagePromises);

      // 파일 다운로드
      const blob = new Blob([markdownContent], {
        type: "text/markdown;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.reportTitle || "report"}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("MD 파일 생성 중 오류:", error);
      alert("MD 파일 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!reportContentRef.current) return;

    setLoading(true);
    handleExportClose();

    try {
      // 고정 여백 설정
      const margin = 20; // 여백

      // PDF 생성
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // A4 크기
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = pdfHeight - margin * 2;

      // 보고서 내용을 캡처
      const canvas = await html2canvas(reportContentRef.current, {
        scale: 1.5, // 해상도 향상
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        scrollX: 0,
        scrollY: 0,
      });

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // PDF 크기에 맞게 이미지 크기 계산 (픽셀을 mm로 변환)
      const pixelToMm = 0.264583; // 96 DPI 기준
      const imgWidthMm = imgWidth * pixelToMm;
      const imgHeightMm = imgHeight * pixelToMm;

      // 콘텐츠 영역에 맞게 스케일 조정
      const scaleX = contentWidth / imgWidthMm;
      const scaleY = contentHeight / imgHeightMm;
      const scale = Math.min(scaleX, 1); // 가로는 페이지에 맞추고, 세로는 자연스럽게

      const finalWidth = imgWidthMm * scale;
      const finalHeight = imgHeightMm * scale;

      // 페이지 수 계산
      const totalPages = Math.ceil(finalHeight / contentHeight);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        // 현재 페이지에서 보여줄 영역 계산
        const startY = page * contentHeight;
        const endY = Math.min(startY + contentHeight, finalHeight);
        const pageHeight = endY - startY;

        // 원본 이미지에서 해당하는 영역 계산
        const sourceStartY = (startY / finalHeight) * imgHeight;
        const sourceEndY = (endY / finalHeight) * imgHeight;
        const sourceHeight = sourceEndY - sourceStartY;

        // 너무 작은 조각이면 건너뛰기
        if (pageHeight < contentHeight * 0.1) {
          continue;
        }

        // 임시 캔버스에 해당 영역만 그리기
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");

        tempCanvas.width = imgWidth;
        tempCanvas.height = sourceHeight;

        tempCtx.drawImage(
          canvas,
          0,
          sourceStartY,
          imgWidth,
          sourceHeight,
          0,
          0,
          imgWidth,
          sourceHeight
        );

        const pageImageData = tempCanvas.toDataURL("image/jpeg", 0.85);

        // 중앙 정렬 계산
        const xPos = margin + (contentWidth - finalWidth) / 2;

        // PDF에 이미지 추가
        pdf.addImage(
          pageImageData,
          "JPEG",
          xPos,
          margin,
          finalWidth,
          pageHeight,
          undefined,
          "FAST"
        );

        // 메모리 정리
        tempCanvas.remove();
      }

      // 파일명 생성 (특수문자 제거)
      const fileName =
        (report.reportTitle || "report")
          .replace(/[^a-zA-Z0-9가-힣\s]/g, "")
          .trim() || "report";

      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("PDF 생성 중 오류 발생:", error);
      alert("PDF 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !report) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!report) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography color="error">보고서를 불러올 수 없습니다.</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="900px" mx="auto" mt={4} mb={8}>
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box ref={reportContentRef}>
          <ReactMarkdown
            children={report.reportContent}
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({ node, ...props }) => (
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    margin: "24px 0",
                  }}
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    margin: "20px 0",
                    borderBottom: "1px solid #ddd",
                    paddingBottom: "8px",
                  }}
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    margin: "16px 0",
                  }}
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "1rem",
                    lineHeight: "1.8",
                    margin: "12px 0",
                  }}
                  {...props}
                />
              ),
              strong: ({ node, ...props }) => (
                <strong style={{ fontWeight: "bold" }} {...props} />
              ),
              img: ({ node, ...props }) => {
                let { src } = props;
                if (src && !src.startsWith("http")) {
                  if (!src.startsWith("/")) {
                    src = "/" + src;
                  }
                }
                return (
                  <img
                    style={{
                      maxWidth: "100%",
                      margin: "24px auto",
                      display: "block",
                    }}
                    {...props}
                    src={src}
                  />
                );
              },
              code: ({ node, inline, className, children, ...props }) =>
                !inline ? (
                  <pre
                    style={{
                      background: "#f5f5f5",
                      borderRadius: "6px",
                      padding: "16px",
                      overflowX: "auto",
                    }}
                  >
                    <code
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.9rem",
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code
                    style={{
                      background: "#f0f0f0",
                      borderRadius: "4px",
                      padding: "2px 6px",
                      fontSize: "0.9rem",
                      fontFamily: "monospace",
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                ),
              a: ({ node, ...props }) => (
                <a
                  style={{ color: "#1976d2", textDecoration: "underline" }}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  style={{ paddingLeft: "24px", margin: "16px 0" }}
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  style={{ paddingLeft: "24px", margin: "16px 0" }}
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li style={{ margin: "8px 0", lineHeight: "1.8" }} {...props} />
              ),
            }}
          />
        </Box>
      </Paper>

      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          variant="contained"
          onClick={handleExportClick}
          disabled={loading}
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
            borderRadius: "8px",
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "내보내기"
          )}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleExportClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <MenuItem onClick={handleExportPDF}>
            <Typography>PDF로 저장</Typography>
          </MenuItem>
          <MenuItem onClick={handleExportMD}>
            <Typography>MD 파일로 저장</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default ReportDetailPage;
