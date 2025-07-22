import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";

const ReportDetailPage = ({ reportId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
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
      </Paper>
    </Box>
  );
};

export default ReportDetailPage;
