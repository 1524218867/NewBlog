import {jwtDecode}  from 'jwt-decode';

export function isTokenExpired() {
  const token = localStorage.getItem("token");
  if (!token) return true; // 如果没有 token，视为过期

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // 当前时间（秒）

    if (decodedToken.exp < currentTime) {
      return true; // 如果 token 已过期
    }

    return false; // 如果 token 没有过期
  } catch (error) {
    console.error("Token decoding failed:", error);
    return true; // 解码失败，视为过期
  }
}
