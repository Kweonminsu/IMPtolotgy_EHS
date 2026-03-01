import { useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { useEnvSafetyStore, PANEL_CONFIG } from '../../store/useEnvSafetyStore';

const ResponsiveGrid = WidthProvider(Responsive);

export default function PanelCanvas() {
  const { 
    layout, 
    setLayout, 
    saveLayout, 
    loadLayout, 
    loadAllData, 
    issues 
  } = useEnvSafetyStore();

  // 컴포넌트 마운트와 동시에 레이아웃 로드 (동기)
  useEffect(() => {
    loadLayout();      // store의 loadLayout 호출 → 기본 레이아웃 강제 적용
    loadAllData();
  }, []);

  // 레이아웃 변경 저장
  const onLayoutChange = (newLayout) => {
    const normalized = newLayout.map(item => ({
      id: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
    }));
    setLayout(normalized);
    saveLayout();
  };

  // layout이 아직 없으면 로딩 표시
  if (layout.length === 0) {
    return <div className="panel-canvas" style={{ padding: '100px', textAlign: 'center' }}>레이아웃 초기화 중...</div>;
  }

  return (
    <div className="panel-canvas">
      <ResponsiveGrid
        className="layout"
        layouts={{ lg: layout }}           // md/sm도 동일하게 lg 사용
        breakpoints={{ lg: 1600, md: 1200, sm: 900 }}
        cols={{ lg: 25, md: 25, sm: 25 }}
        rowHeight={46}
        margin={[20, 20]}
        containerPadding={[20, 20]}

        onLayoutChange={onLayoutChange}

        compactType={null}
        preventCollision={true}
        isResizable={true}
        isDraggable={true}
        draggableHandle=".drag-handle"

        measureBeforeMount={true}
        useCSSTransforms={true}
      >
        {layout.map((item) => {
          const config = PANEL_CONFIG[item.id];
          if (!config) return null;

          return (
            <div 
              key={item.id} 
              data-grid={item} 
              className="draggable-panel"
            >
              <div className="drag-handle">
                <span style={{ marginRight: '8px' }}>{config.icon}</span>
                {config.title}
              </div>

              <div className="block-header">
                <h2 className="block-title">
                  <span className="title-text">{config.title}</span>
                </h2>
              </div>

              <div style={{ 
                padding: '24px', 
                minHeight: '200px', 
                color: '#444', 
                textAlign: 'center',
                background: '#fafafa'
              }}>
                {config.title} 내용 영역<br />
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