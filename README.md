# 萬春・廟口通（示範版）

2026 LINE AI 創新創業競賽的可操作原型：以 LINE OA 為入口、LINE MINI App 為服務載體，串起萬春宮文化導覽、情境推薦、示範優惠券與店家核銷。

> 本專案使用虛構的示範店家與優惠資料；不代表萬春宮或任何真實店家已合作。

## 模組

- `src/modules/explorer`：訪客導覽、情境選擇、受控 AI 推薦與領券。
- `src/modules/merchant`：店家 PIN 入口、一次性券碼核銷與成效儀表板。
- `src/modules/shared`：跨模組型別、版面與共用元件。
- `supabase/migrations`：試營運用的資料模型、RLS 權限與一次性核銷 RPC。

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

## 試營運資料庫準備

目前前端沒有連線資料庫，方便穩定地進行競賽展示。若要跨裝置實測一次性券碼與店家成效，可使用 Supabase 執行 [安全 migration](supabase/migrations/202608030001_secure_coupon_core.sql)；資料範圍與上線安全清單見 [資料庫安全計畫](docs/database-security-plan.md)。

前端以 `.env` 內的 `VITE_SUPABASE_URL` 與 `VITE_SUPABASE_PUBLISHABLE_KEY` 連線；只可使用 publishable key，範例見 `.env.example`。設定後會讀取雲端示範優惠。領券會以 LIFF 取得的 ID token 呼叫 `line-claim-coupon` Edge Function；Function 在伺服器端向 LINE 驗證 token，且只保存加鹽雜湊後的 LINE subject。

### LINE Login 上線設定

1. 在 LINE Developers Console 建立 LINE Login channel 與 LIFF app，啟用 `openid` scope，並將部署後的 HTTPS 網址設為 Endpoint URL。
2. 將 LIFF ID 設為 `VITE_LIFF_ID`（這是公開設定）。
3. 設定 Edge Function secrets：`LINE_LOGIN_CHANNEL_ID`、高熵的 `LINE_SUBJECT_HASH_SECRET`，以及完全相同的 `APP_ORIGIN`。
4. 在 **Settings → API Keys** 建立名為 `function_admin` 的 secret key；再為 `line-claim-coupon` 設定伺服器端 secrets（`APP_ORIGIN`、`LINE_LOGIN_CHANNEL_ID`、`LINE_SUBJECT_HASH_SECRET`）。最後部署：`npx supabase functions deploy line-claim-coupon --no-verify-jwt`。Function 會從 Supabase 提供的 `SUPABASE_SECRET_KEYS` 讀取 `function_admin`，並在伺服器端驗證 LINE ID token。

LINE channel secret、Supabase secret/service key 與 LINE subject 都不可寫入 `.env`、前端程式或版本控制。
