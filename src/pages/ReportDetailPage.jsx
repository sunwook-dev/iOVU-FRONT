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
import htmlDocx from "html-docx-js/dist/html-docx";
import { saveAs } from "file-saver";

const ReportDetailPage = ({ reportId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
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

    setExporting(true);
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
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!reportContentRef.current) return;

    setExporting(true);
    handleExportClose();

    try {
      // HTML2Canvas로 화면 캡처 (한글 폰트 문제 해결)
      const canvas = await html2canvas(reportContentRef.current, {
        scale: 2, // 고해상도로 캡처
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        scrollX: 0,
        scrollY: 0,
        // 한글 폰트 렌더링 최적화
        letterRendering: true,
        imageTimeout: 10000,
        removeContainer: true,
      });

      // PDF 생성
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // 픽셀을 mm로 변환
      const pixelToMm = 0.264583;
      const imgWidthMm = imgWidth * pixelToMm;
      const imgHeightMm = imgHeight * pixelToMm;

      // 콘텐츠에 맞게 스케일 조정
      const scale = Math.min(contentWidth / imgWidthMm, 1);
      const finalWidth = imgWidthMm * scale;
      const finalHeight = imgHeightMm * scale;

      // 페이지 수 계산
      const totalPages = Math.ceil(finalHeight / contentHeight);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        // 현재 페이지 영역 계산
        const startY = page * contentHeight;
        const endY = Math.min(startY + contentHeight, finalHeight);
        const pageHeightActual = endY - startY;

        // 원본 이미지에서 해당 영역 계산
        const sourceStartY = (startY / finalHeight) * imgHeight;
        const sourceEndY = (endY / finalHeight) * imgHeight;
        const sourceHeight = sourceEndY - sourceStartY;

        // 임시 캔버스 생성
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");

        tempCanvas.width = imgWidth;
        tempCanvas.height = sourceHeight;

        // 해당 영역만 그리기
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

        // 고품질 JPEG로 변환
        const pageImageData = tempCanvas.toDataURL("image/jpeg", 0.95);

        // 중앙 정렬
        const xPos = margin + (contentWidth - finalWidth) / 2;

        // PDF에 이미지 추가
        pdf.addImage(
          pageImageData,
          "JPEG",
          xPos,
          margin,
          finalWidth,
          pageHeightActual
        );

        // 메모리 정리
        tempCanvas.remove();
      }

      // 파일명 생성
      const fileName =
        (report.reportTitle || "report")
          .replace(/[^a-zA-Z0-9가-힣\s]/g, "")
          .trim() || "report";

      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("PDF 생성 중 오류 발생:", error);
      alert("PDF 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setExporting(false);
    }
  };

  /**
   * 보고서 내용을 Word 문서(.docx)로 내보내는 함수입니다.
   * HTML을 Word 형식으로 변환하여 다운로드합니다.
   */
  const handleExportWord = async () => {
    if (!reportContentRef.current || !report) return;

    setExporting(true);
    handleExportClose();

    try {
      // 보고서 제목을 포함한 완전한 HTML 생성
      const reportTitle = report.reportTitle || "보고서";

      // 이미지를 base64로 변환하여 포함
      const imgElements = reportContentRef.current.querySelectorAll("img");
      let htmlContent = reportContentRef.current.innerHTML;

      // 이미지들을 base64로 변환 (크기 축소 및 화질 개선)
      for (const img of imgElements) {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const tempImg = new Image();
          tempImg.crossOrigin = "anonymous";

          await new Promise((resolve, reject) => {
            tempImg.onload = () => {
              // 이미지 크기를 0.2배로 축소
              const scaleFactor = 0.2;
              const newWidth = tempImg.width * scaleFactor;
              const newHeight = tempImg.height * scaleFactor;

              canvas.width = newWidth;
              canvas.height = newHeight;

              // 화질 개선을 위한 설정
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = "high";

              // 고품질 리사이징을 위한 단계적 축소
              if (scaleFactor < 0.5) {
                // 0.5배보다 작을 때는 단계적으로 축소하여 화질 향상
                const tempCanvas = document.createElement("canvas");
                const tempCtx = tempCanvas.getContext("2d");

                let currentWidth = tempImg.width;
                let currentHeight = tempImg.height;

                tempCanvas.width = currentWidth;
                tempCanvas.height = currentHeight;
                tempCtx.drawImage(tempImg, 0, 0);

                // 50%씩 단계적으로 축소
                while (
                  currentWidth * 0.5 > newWidth ||
                  currentHeight * 0.5 > newHeight
                ) {
                  currentWidth *= 0.5;
                  currentHeight *= 0.5;

                  const nextCanvas = document.createElement("canvas");
                  const nextCtx = nextCanvas.getContext("2d");
                  nextCanvas.width = currentWidth;
                  nextCanvas.height = currentHeight;

                  nextCtx.imageSmoothingEnabled = true;
                  nextCtx.imageSmoothingQuality = "high";
                  nextCtx.drawImage(
                    tempCanvas,
                    0,
                    0,
                    currentWidth,
                    currentHeight
                  );

                  tempCanvas.width = currentWidth;
                  tempCanvas.height = currentHeight;
                  tempCtx.clearRect(0, 0, currentWidth, currentHeight);
                  tempCtx.drawImage(nextCanvas, 0, 0);
                  nextCanvas.remove();
                }

                // 최종 크기로 조정
                ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
                tempCanvas.remove();
              } else {
                // 직접 리사이징
                ctx.drawImage(tempImg, 0, 0, newWidth, newHeight);
              }

              // 고품질 JPEG로 변환 (PNG 대신 JPEG 사용하여 파일 크기 최적화)
              const base64Data = canvas.toDataURL("image/jpeg", 0.95);
              const imgSrc = img.getAttribute("src");

              if (imgSrc) {
                // HTML에서 이미지 소스를 base64로 교체
                htmlContent = htmlContent.replace(
                  new RegExp(
                    `src\\s*=\\s*["']${imgSrc.replace(
                      /[.*+?^${}()|[\]\\]/g,
                      "\\$&"
                    )}["']`,
                    "g"
                  ),
                  `src="${base64Data}"`
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
        }
      }

      // Word 문서용 HTML 구조 생성
      const wordHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${reportTitle}</title>
          <style>
            body {
              font-family: "맑은 고딕", "Malgun Gothic", "나눔고딕", "Nanum Gothic", Arial, sans-serif;
              font-size: 11pt;
              line-height: 1.6;
              margin: 40px;
              color: #333;
            }
            h1 {
              font-size: 24pt;
              font-weight: bold;
              margin: 24px 0;
              color: #1a1a1a;
            }
            h2 {
              font-size: 18pt;
              font-weight: bold;
              margin: 20px 0;
              border-bottom: 1px solid #ddd;
              padding-bottom: 8px;
              color: #1a1a1a;
            }
            h3 {
              font-size: 14pt;
              font-weight: bold;
              margin: 16px 0;
              color: #1a1a1a;
            }
            p {
              margin: 12px 0;
              text-align: justify;
            }
            img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 20px auto;
            }
            pre {
              background: #f5f5f5;
              border: 1px solid #ddd;
              border-radius: 4px;
              padding: 16px;
              overflow-x: auto;
              font-family: "Consolas", "Monaco", "Courier New", monospace;
              font-size: 10pt;
            }
            code {
              background: #f0f0f0;
              border-radius: 3px;
              padding: 2px 6px;
              font-family: "Consolas", "Monaco", "Courier New", monospace;
              font-size: 10pt;
            }
            ul, ol {
              margin: 16px 0;
              padding-left: 24px;
            }
            li {
              margin: 8px 0;
            }
            a {
              color: #1976d2;
              text-decoration: underline;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 16px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <h1>${reportTitle}</h1>
          ${htmlContent}
        </body>
        </html>
      `;

      // HTML을 Word 문서로 변환 (asBlob 메서드 사용)
      const converted = htmlDocx.asBlob(wordHTML, {
        orientation: "portrait",
        margins: {
          top: 1440,
          right: 1440,
          bottom: 1440,
          left: 1440,
        },
      });

      // 파일명 생성 (특수문자 제거)
      const fileName =
        reportTitle.replace(/[^a-zA-Z0-9가-힣\s]/g, "").trim() || "report";

      // 파일 다운로드
      saveAs(converted, `${fileName}.docx`);
    } catch (error) {
      console.error("Word 파일 생성 중 오류:", error);
      alert(
        "Word 파일 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setExporting(false);
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
          disabled={loading || exporting}
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
            borderRadius: "8px",
          }}
        >
          {loading || exporting ? (
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
          <MenuItem onClick={handleExportWord}>
            <Typography>Word로 저장</Typography>
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
