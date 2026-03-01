import PanelCanvas from './components/layout/PanelCanvas';
import { useEnvSafetyStore } from './store/useEnvSafetyStore';
import './styles/env_safety.css';

function App() {
  const resetLayout = useEnvSafetyStore((state) => state.resetLayout);

  return (
    <div className="env-safety-page" id="env-safety-root">
      {/* DOM1 헤더는 그대로 유지 */}
      <div className="dom-block dom1" id="dom1">
        <div className="page-header-inner">
          <div className="header-left">
            <span className="header-badge">SAFETY OPS</span>
            <h1 className="page-title">
              환경안전 운영 <span className="accent">현황판</span>
            </h1>
            <p className="page-sub">산업현장 이슈 등록 · 체크리스트 · To-Do 관리</p>
          </div>
          <div className="header-right">
            <button 
              className="btn-reset-layout" 
              onClick={() => useEnvSafetyStore.getState().resetLayout()}
            >
              레이아웃 초기화
            </button>
            <button className="btn-primary">이슈 등록</button>
          </div>
        </div>
      </div>

      {/* 핵심: 드래그 가능한 패널 영역 */}
      <PanelCanvas />
    </div>
  );
}

export default App;