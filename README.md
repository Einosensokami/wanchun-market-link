# 萬春・廟口通（示範版）

2026 LINE AI 創新創業競賽的可操作原型：以 LINE OA 為入口、LINE MINI App 為服務載體，串起萬春宮文化導覽、情境推薦、示範優惠券與店家核銷。

> 本專案使用虛構的示範店家與優惠資料；不代表萬春宮或任何真實店家已合作。

## 模組

- `src/modules/explorer`：訪客導覽、情境選擇、受控 AI 推薦與領券。
- `src/modules/merchant`：店家 PIN 入口、一次性券碼核銷與成效儀表板。
- `src/modules/shared`：跨模組型別、版面與共用元件。
- `src/data`：明確標記的示範資料與推薦規則。

## 執行

```bash
npm install
npm run dev
```

## 驗證

```bash
npm run build
npm run lint
npm run test
```

## Demo 安全邊界

- 不蒐集或保存具體祈願文字；只處理功能性情境分類。
- 優惠券採單次核銷狀態模擬，避免同券重複核銷。
- 店家端為示範 PIN 閘道；正式上線必須改為伺服器端身分驗證與授權。
- LINE Service Message 不用於促銷；提醒流程在正式整合時應使用符合 LINE 規範的 OA 訊息機制。
