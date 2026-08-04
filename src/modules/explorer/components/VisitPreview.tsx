interface VisitPreviewProps {
  isFollowingOfficialAccount: boolean
  onContinue: () => void
  onFollowOfficialAccount: () => void
}

export function VisitPreview({ isFollowingOfficialAccount, onContinue, onFollowOfficialAccount }: VisitPreviewProps) {
  return <section aria-label="萬春宮參訪與文化預覽">
    <div style={lineJourneyStyle}>
      <p style={journeyLabelStyle}>LINE 生態串連</p>
      <ol style={journeyListStyle}>
        {['廟口 QR 進入 OA', '情境對話找路線', 'LIFF 領取優惠券', 'OA 活動與到期提醒'].map((step, index) => <li key={step} style={journeyStepStyle}><b style={journeyNumberStyle}>{index + 1}</b><span>{step}</span></li>)}
      </ol>
    </div>
    <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
      <article style={cardStyle}>
        <span aria-hidden="true" style={{ fontSize: 28 }}>🙏</span>
        <div><strong style={{ color: '#422716' }}>安心參拜｜約 3 分鐘</strong><p style={copyStyle}>入口 → 參拜順序 → 主祀神明與祈求方向。完整內容將由宮廟核定後提供。</p></div>
      </article>
      <article style={cardStyle}>
        <span aria-hidden="true" style={{ fontSize: 28 }}>🏮</span>
        <div><strong style={{ color: '#422716' }}>萬春故事｜文化小預覽</strong><p style={copyStyle}>從廟宇細節看見地方記憶；加好友後可開啟完整故事點與周邊地圖。</p></div>
      </article>
    </div>
    {!isFollowingOfficialAccount
      ? <button type="button" onClick={onFollowOfficialAccount} style={primaryButton}>加入「萬春・廟口通」LINE OA（示範）</button>
      : <><p role="status" style={{ color: '#255e38', fontSize: 14, fontWeight: 700, margin: '18px 0 0' }}>✓ 已加入 OA 示範狀態，可領券並接收後續提醒。</p><aside style={oaMessageStyle}><strong>LINE OA 訊息示範</strong><span>你的「參拜後伴手禮」優惠券已加入行程；活動前一天將由 OA 提醒使用期限。</span></aside><button type="button" onClick={onContinue} style={primaryButton}>開始規劃今天的廟口行程</button></>}
  </section>
}

const cardStyle = { background: '#fffaf3', border: '1px solid #ead9c7', borderRadius: 16, display: 'flex', gap: 12, padding: 16 }
const copyStyle = { color: '#695747', fontSize: 14, lineHeight: 1.55, margin: '6px 0 0' }
const primaryButton = { background: '#9f3f22', border: 0, borderRadius: 12, color: '#fff', cursor: 'pointer', fontSize: 16, fontWeight: 700, marginTop: 20, padding: '14px 18px', width: '100%' }
const lineJourneyStyle = { background: '#f2f8f3', border: '1px solid #d6e8da', borderRadius: 15, marginTop: 20, padding: 14 }
const journeyLabelStyle = { color: '#367052', fontSize: 12, fontWeight: 800, letterSpacing: '.05em', margin: 0 }
const journeyListStyle = { display: 'grid', gap: 8, listStyle: 'none', margin: '11px 0 0', padding: 0 }
const journeyStepStyle = { alignItems: 'center', color: '#3d5949', display: 'flex', fontSize: 13, gap: 9 }
const journeyNumberStyle = { background: '#3f8060', borderRadius: 99, color: '#fff', display: 'inline-grid', fontSize: 11, height: 20, placeItems: 'center', width: 20 }
const oaMessageStyle = { background: '#eff8f1', borderLeft: '3px solid #4c936c', borderRadius: 8, color: '#426250', display: 'grid', fontSize: 13, gap: 4, lineHeight: 1.5, marginTop: 12, padding: '10px 12px' }
