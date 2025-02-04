// export const BACKEND_HTTP_URI = 'http://localhost:8080'; // dev
export const BACKEND_HTTP_URI = 'https://budin.azumidev.web.id'; // prod

export const WEBSOCKET_URI =  'wss://budin.azumidev.web.id/ws'
/*
  Use when using dev mode
*/
// const getWebSocketUrl = () => {
//   const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
//   const host = import.meta.env.PROD ? 'budin.azumidev.web.id' : 'localhost:8080';
//   return `${protocol}//${host}/ws`;
// };
// export const WEBSOCKET_URI = getWebSocketUrl();
/*
  End of getWebSocketUrl() as WEBSOCKET_URI
*/