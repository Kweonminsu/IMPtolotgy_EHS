import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/env_safety.css'

// StrictMode를 제거합니다 (깜빡임 해결의 가장 빠른 방법)
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />          // ← StrictMode 주석 처리 또는 완전 제거
)