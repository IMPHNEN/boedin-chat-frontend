export const BACKEND_HTTP_URI = 'http://localhost:8080'; // dev
// export const BACKEND_HTTP_URI = 'https://budin.azumidev.web.id'; // prod
// export const WEBSOCKET_URI = 'ws://localhost:8080/ws'; //dev
// export const WEBSOCKET_URI =  'wss://budin.azumidev.web.id/ws'
// http://localhost:5173/authorized?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzMjI2NjMxMDgxNzI3MDk4ODkiLCJ1c2VybmFtZSI6Ino0cHIiLCJyb2xlIjoiTWVtYmVyIiwiZXhwIjoxNzM4NzY5OTc3fQ.rdfqzqjGTNzBgsjViVwAE_lHYIPoC_suVZXPuksagGw
const getWebSocketUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = import.meta.env.PROD ? 'budin.azumidev.web.id' : 'localhost:8080';
  return `${protocol}//${host}/ws`;
};

export const WEBSOCKET_URI = getWebSocketUrl();