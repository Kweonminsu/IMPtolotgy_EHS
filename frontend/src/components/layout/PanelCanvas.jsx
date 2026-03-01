import { useEffect, useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { useEnvSafetyStore, PANEL_CONFIG } from '../../store/useEnvSafetyStore';

const ResponsiveGrid = WidthProvider(Responsive);

export default function PanelCanvas() {
  const { layout, setLayout, saveLayout, issues, isLoading, loadAllData } = useEnvSafetyStore();

  // 초기 데이터 로드
  useEffect(() => {
    loadAllData();
    useEnvSafetyStore.getState().loadLayout();
  }, []);

  // layout이 안정적으로 유지되도록 useMemo 사용 (이게 깜빡임의 핵심 원인!)
  const stableLayout = useMemo(() => {
    if (layout.length > 0) return layout;

    // 기본 레이아웃 (겹치지 않게 x 좌표 넓게 배치)
    return [
      { id: 'dom2', x: 0,  y: 0,  w: 7,  h: 9 },
      { id: 'dom8', x: 7,  y: 0,  w: 6,  h: 6 },
      { id: 'dom9', x: 13, y: 0,  w: 7,  h: 9 },
      { id: 'dom3', x: 0,  y: 9,  w: 5,  h: 7 },
      { id: 'dom4', x: 5,  y: 9,  w: 5,  h: 7 },
      { id: 'dom6', x: 10, y: 9,  w: 5,  h: 7 },
      { id: 'dom5', x: 15, y: 9,  w: 5,  h: 6 },
      { id: 'dom7', x: 20, y: 9,  w: 5,  h: 6 },
    ];
  }, [layout]);

  const onLayoutChange = (newLayout) => {
    setLayout(newLayout);
    saveLayout();
  };

  if (isLoading) {
    return <div className="panel-canvas" style={{ padding: '60px', textAlign: 'center' }}>로딩 중...</div>;
  }

  return (
    <div className="panel-canvas">
      <ResponsiveGrid
        className="layout"
        layouts={{ lg: stableLayout }}
        breakpoints={{ lg: 1600, md: 1200, sm: 768 }}
        cols={{ lg: 25, md: 20, sm: 12 }}
        rowHeight={42}
        margin={[16, 16]}
        onLayoutChange={onLayoutChange}
        compactType="vertical"
        preventCollision={false}
        isResizable={true}
        isDraggable={true}
        measureBeforeMount={true}        // ← 깜빡임 방지 핵심
        useCSSTransforms={true}          // ← 성능 + 깜빡임 개선
      >
        {stableLayout.map((item) => {
          const config = PANEL_CONFIG[item.id];
          if (!config) return null;

          return (
            <div key={item.id} data-grid={item} className="draggable-panel">
              {/* 드래그 핸들 */}
              <div className="drag-handle">
                <span style={{ marginRight: '8px' }}>{config.icon}</span>
                {config.title}
              </div>

              {/* 헤더 */}
              <div className="block-header">
                <h2 className="block-title">
                  <span className="title-text">{config.title}</span>
                </h2>
              </div>

              {/* 내용 영역 (나중에 각 컴포넌트로 교체) */}
              <div style={{ padding: '20px', minHeight: '160px', color: '#444', textAlign: 'center' }}>
                {config.title} 패널<br />
                <small>이슈 {issues.length}개 로드됨</small>
              </div>

              <div className="resize-handle" />
            </div>
          );
        })}
      </ResponsiveGrid>
    </div>
  );
}