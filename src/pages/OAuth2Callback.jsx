import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { handleOAuth2Callback } from '../services/socialLogin';
import { useAuth } from '../contexts/AuthContext';
import { cleanupUnnecessaryTokens } from '../utils/auth';

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  // 컴포넌트가 마운트되었음을 확인
  console.log('OAuth2Callback component mounted!');
  console.log('Current location:', window.location.href);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // 디버깅: 현재 URL과 모든 파라미터 로그
        console.log('OAuth2Callback - Current URL:', window.location.href);
        console.log('OAuth2Callback - Search params:', Object.fromEntries(searchParams.entries()));
        
        // 모든 가능한 파라미터 이름들 체크
        const allParams = Object.fromEntries(searchParams.entries());
        console.log('🔍 모든 URL 파라미터들:', allParams);
        
        // provider 관련 파라미터들 찾기
        const possibleProviders = Object.keys(allParams).filter(key => 
          key.toLowerCase().includes('provider')
        );
        console.log('🔍 Provider 관련 파라미터들:', possibleProviders);
        
        // 이미 로그인되어 있고 이전 로그인 세션의 토큰이 있는 경우 중복 처리 방지
        const existingToken = localStorage.getItem('access_token');
        if (existingToken && !searchParams.get('access_token') && !searchParams.get('token')) {
          console.log('OAuth2Callback - 이미 로그인된 사용자, 중복 처리 방지');
          navigate('/search');
          return;
        }
        
        // URL 파라미터에서 토큰과 사용자 정보 추출 (백엔드 실제 형식에 맞춤)
        const token = searchParams.get('access_token') || searchParams.get('token') || searchParams.get('accessToken');
        const refreshToken = searchParams.get('refresh_token') || searchParams.get('refreshToken');
        const userInfo = searchParams.get('userInfo') || searchParams.get('user_info');
        
        // Provider 정보 추출 - 다양한 형태 시도
        let provider = searchParams.get('provider') || 
                        searchParams.get('oauth_provider') || 
                        searchParams.get('social_provider') ||
                        searchParams.get('loginType') ||
                        searchParams.get('type');
        
        // Provider가 없는 경우 URL이나 referrer에서 유추 시도
        if (!provider) {
          const currentUrl = window.location.href.toLowerCase();
          const referrer = document.referrer.toLowerCase();
          
          if (currentUrl.includes('google') || referrer.includes('google')) {
            provider = 'google';
            console.log('🔍 URL에서 Google provider 유추');
          } else if (currentUrl.includes('kakao') || referrer.includes('kakao')) {
            provider = 'kakao';
            console.log('🔍 URL에서 Kakao provider 유추');
          } else if (currentUrl.includes('naver') || referrer.includes('naver')) {
            provider = 'naver';
            console.log('🔍 URL에서 Naver provider 유추');
          } else {
            console.warn('⚠️ Provider를 유추할 수 없음');
          }
        }

        console.log('OAuth2Callback - Extracted data:', {
          token: token ? 'present' : 'missing',
          refreshToken: refreshToken ? 'present' : 'missing',
          userInfo: userInfo ? 'present' : 'missing',
          provider,
          providerFromParams: {
            'provider': searchParams.get('provider'),
            'oauth_provider': searchParams.get('oauth_provider'),
            'social_provider': searchParams.get('social_provider'),
            'loginType': searchParams.get('loginType'),
            'type': searchParams.get('type'),
          },
          // 디버깅: 실제 파라미터 값들도 확인
          tokenValue: token ? token.substring(0, 20) + '...' : 'none',
          refreshTokenValue: refreshToken ? refreshToken.substring(0, 20) + '...' : 'none'
        });

        if (!token) {
          // 토큰이 없고 URL 파라미터도 없는 경우 - 잘못된 접근
          if (Object.keys(Object.fromEntries(searchParams.entries())).length === 0) {
            console.log('OAuth2Callback - 파라미터 없는 잘못된 접근, 메인 페이지로 이동');
            navigate('/');
            return;
          }
          
          // 에러 처리
          const error = searchParams.get('error');
          console.error('OAuth2 callback error:', error);
          navigate('/login?error=' + encodeURIComponent(error || '로그인에 실패했습니다.'));
          return;
        }

        // 사용자 정보 파싱
        const parsedUserInfo = userInfo ? JSON.parse(decodeURIComponent(userInfo)) : null;

        // 토큰 및 사용자 정보 저장
        const result = handleOAuth2Callback(token, refreshToken, parsedUserInfo, provider);

        if (result.success) {
          // 불필요한 localStorage 항목 정리
          cleanupUnnecessaryTokens();
          
          // AuthContext에 사용자 정보 설정
          login(result.user);
          // 로그인 성공 후 검색 페이지로 리다이렉트
          navigate('/search');
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('OAuth2 callback processing failed:', error);
        navigate('/login?error=' + encodeURIComponent('로그인 처리 중 오류가 발생했습니다.'));
      }
    };

    processCallback();
  }, [searchParams, navigate, login]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <CircularProgress size={60} sx={{ mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
        로그인 처리 중...
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        잠시만 기다려주세요.
      </Typography>
    </Box>
  );
};

export default OAuth2Callback;
