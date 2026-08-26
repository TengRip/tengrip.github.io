# tengrip.github.io — MaxTeng 開發者首頁

> 獨立開發者 RIP（MaxTeng）的品牌首頁，列出所有 App 的 Android／iOS 上架卡片，同時放 `app-ads.txt`（AdMob 驗證用）與各 App 的隱私政策頁。

**線上網址：** https://tengrip.github.io
**GitHub repo：** `TengRip/tengrip.github.io`（公開，預設分支 `main`）
**版次：** v3.10
**日期：** 2026-08-26
**狀態：** 已上架 19 張卡片、即將推出 1 張卡片

---

## 資料夾結構

```
tengrip.github.io/
├── index.html          # 首頁本體，App 卡片清單
├── app-ads.txt          # AdMob 驗證用，格式固定不要動
├── assets/icons/        # 各 App icon，統一裁成 180×180 png
└── privacy/{app}/       # 各 App 隱私政策頁（部分 App 仍用舊的獨立 repo，見下方說明）
```

## 卡片規則（重要，之後新增/更新卡片前先看這段）

- **已上架**區：至少一個平台（Android 或 iOS）已經是「正式版／已通過審核公開可查」才能放進來，用 `apps public view` 或商店頁面實際打開確認，不要只憑記憶判斷。
  - 兩平台都上架 → `app app-dual` 樣式，`store-links` 放兩個真連結（Google Play + App Store）
  - 只有一個平台上架、另一個平台已送審 → 一樣 `app app-dual`，已上架那個放真連結，另一個放 `<span class="store-badge pending">App Store 審核中</span>`
  - 只有一個平台、且另一個平台完全沒有開發計畫或已放棄（如 Blackjack 因模擬賭博政策被拒且確定不重送）→ **一律用 `app app-dual` + `store-links` 單一徽章樣式**（Android 用「Google Play」、iOS 用「App Store」），跟雙平台卡片外觀一致；**不要**用整卡可點的 `<a class="app">` + 右側「→」箭頭樣式，那個樣式專門保留給「網站作品」區（非 App Store 商品）用（2026-08-26 v3.10 統一過，之前 Jotlo/Filelo/Cliplo/Blackjack 誤用了箭頭樣式）
- **即將推出**區：兩個平台都還沒上架，但至少一邊已經送審或在測試中，才值得放卡片。兩邊都完全沒開始動工的 App 不用勉強做卡片。
  - 橘色 `.badge`：Android 狀態，文字依實際情況寫（例如「Android 測試中」），不要固定套用「審核中」
  - 藍灰 `.ios-badge`：iOS「準備中」＝已完成開發但尚未送審；`.ios-badge.review`（多一個 `review` class）＝「iOS 審核中」＝已送出等 Apple 結果，兩者語意不同，別混用
- 每張卡片的四語輪播說明（`desc-cycle`）順序固定：繁中 → 英文 → 日文 → 韓文，全形句號 `。` 只用在日文/韓文結尾，繁中/英文用半形句點

## 查證方式（不要只憑 memory 判斷上架狀態）

```bash
# 列出 App Store Connect 全部 App
asc apps list --paginate --output table

# 查單一 App 的版本狀態（READY_FOR_DISTRIBUTION/READY_FOR_SALE 才可能是真上架，
# WAITING_FOR_REVIEW/IN_REVIEW 是送審中，REJECTED 要另外確認是否已放棄）
asc status --app <App ID> --include app,appstore --output json

# 再用公開頁面二次確認真的抓得到（版本狀態顯示已核准，不代表商店頁面已經公開）
asc apps public view --app <App ID> --country tw --output json
```

Android 正式版清單沒有對應的 CLI，直接跟 RIP 要 Google Play Console 首頁截圖最準確（「應用程式狀態」欄要顯示「正式版」）。

## 本地預覽

`file://` 協定在部分瀏覽器自動化工具會被擋，本地測試改用：

```bash
cd tengrip.github.io
python -m http.server 8930
# 開 http://localhost:8930/index.html
```

---

## 版本紀錄

| 版次 | 日期 | 說明 |
|---|---|---|
| v3.12 | 2026-08-26 | PlayShot Studio 新增 iOS App Store 尺寸支援（iPhone 6.9 吋＋iPad 13 吋），網站作品卡片文案從「Google Play 商店展示圖一鍵生成工具」改成平台中立的「Android／iOS 商店截圖一鍵生成工具」（四語言同步更新）。 |
| v3.11 | 2026-08-26 | 「網站作品」區的 PlayShot Studio 卡片連結從 `playshot-studio.vercel.app` 換成新接的自訂網域 `playshotstudio.maxteng.org`（該站已完成品牌重新設計＋GA4＋Search Console＋AdSense scaffold）。 |
| v3.10 | 2026-08-26 | RIP 要求外觀一致性：Android-only 4 張卡片（Jotlo/Filelo/Cliplo/Blackjack Trainer Pro）原本是整卡可點的 `<a class="app">` + 右側「→」箭頭樣式，改成跟其他卡片一樣的 `app app-dual` + `store-links` 單一「Google Play」徽章樣式。純視覺一致性調整，連結網址不變。 |
| v3.9 | 2026-08-26 | Snifflo iOS＋Android 皆已是正式版（`asc versions list` 確認 iOS `READY_FOR_DISTRIBUTION`，商店頁面 `apps.apple.com/tw/app/id6790632614` 與 Google Play `play.google.com/store/apps/details?id=com.maxteng.snifflo` 皆實測 200）。卡片從「即將推出」搬到「已上架」，用 `app app-dual` 樣式＋雙平台真連結。「即將推出」區只剩 Scriblo 一張。 |
| v3.8 | 2026-08-26 | Tracklo iOS 審核通過並發佈正式版（`asc versions list` 確認 `READY_FOR_DISTRIBUTION`，商店頁面 `apps.apple.com/tw/app/id6797240955` 實測 200）。卡片從「即將推出」搬到「已上架」，用 `app app-dual` 樣式＋單一 App Store 徽章（Android 正式版申請被 Google 打回，重跑 14 天封測中，暫無 Google Play 徽章）。 |
| v3.7 | 2026-08-26 | Readlo iOS 審核通過並發佈正式版（`asc versions list` 確認 `READY_FOR_SALE`／`READY_FOR_DISTRIBUTION`，商店頁面 `apps.apple.com/tw/app/id6798077578` 實測 200）。卡片從「即將推出」搬到「已上架」，用 `app app-dual` 樣式＋單一 App Store 徽章（Android 正式版存取權申請被 Google 打回，尚在重跑 14 天封測，暫無 Google Play 徽章可放）。 |
| v3.6 | 2026-08-26 | RIP 確認後再拿掉 Dobby Blog 卡片，「網站作品」區剩 8 張：貓知道、RoadGuard 網頁版、SlimDrop、Living Portrait、Ticklo／Cheatlo／Cliplo 網頁版、PlayShot Studio。 |
| v3.5 | 2026-08-26 | RIP 確認後拿掉 ChronoTrace、iPAS 練習工具、AvatarPal 三張卡片（先不對外展示），「網站作品」區剩 9 張：貓知道、RoadGuard 網頁版、SlimDrop、Living Portrait、Ticklo／Cheatlo／Cliplo 網頁版、Dobby Blog、PlayShot Studio。 |
| v3.4 | 2026-08-26 | **新增「網站作品」分區**：在既有 App 卡片（已上架／即將推出）下方新增 12 張網站作品卡片（貓知道、RoadGuard 網頁版、SlimDrop、Living Portrait、Ticklo／Cheatlo／Cliplo 網頁版、Dobby Blog、PlayShot Studio、ChronoTrace、iPAS 練習工具、AvatarPal），沿用 `.app` 卡片結構＋四語輪播說明，圖示改用 emoji 方塊（新增 `.site-icon` class）取代 App icon 圖檔，避免另外準備圖片素材。刻意不收錄：貓空纜車調度系統／事故輔導改善 AI 助理（幫特定單位做的內部系統，公開曝光有職場疑慮）、小放電（朋友接案站，內容尚未補齊）、app-radar／PAO Wizard（RIP 自用內部工具非作品展示）。改完用本地 `python -m http.server`＋瀏覽器截圖核對排版無跑版。 |
| v3.3 | 2026-08-20 | PixZap iOS 審核通過並發佈正式版（`asc status` 確認 `READY_FOR_DISTRIBUTION`）。把 `store-links` 裡的 `<span class="store-badge pending">App Store 審核中</span>` 換成真連結 `apps.apple.com/tw/app/id6796897369`，變成雙平台真連結卡片。順帶更新 PetSoul：今天稍早重新送審後狀態已變成 `WAITING_FOR_REVIEW`，卡片文字從「iOS 準備中」改成「iOS 審核中」（沿用 pending 樣式，只換文字，站上還沒有真連結可放）。 |
| v3.2 | 2026-08-16 | Chronlo iOS 審核通過並發佈正式版（`asc status` 確認 `READY_FOR_DISTRIBUTION`，商店頁面 `apps.apple.com/tw/app/id6790975397` 實測 200）。卡片本來就在「已上架」區塊（Android 已是正式版），這次只是把 `store-links` 裡的 `<span class="store-badge pending">App Store 審核中</span>` 換成真連結，變成跟 Ticklo/RoadGuard 一樣的雙平台真連結卡片。 |
| v3.1 | 2026-08-14 | **再次用 asc CLI 全站 17 支 App 逐一查證＋RIP 提供 Google Play Console 截圖（14 支 Android 正式版）大整理**。**查出重要落差**：Warplo iOS 其實已通過審核上架（`READY_FOR_DISTRIBUTION`，商店頁面可打開），從「即將推出」搬到「已上架」（單一 App Store 徽章，無 Android 計畫）；Ticklo、Talklo、Cheatlo、Memorlo 的 Android 版其實都已轉正式版，四張卡片補上 Google Play 徽章變成雙平台。**發現 5 支 App 的 iOS 最新版本從送審中變成 `REJECTED`**（PetSoul、Snifflo、Readlo、Tracklo、Scriblo），商店頁面目前都無法公開存取，卡片上原本寫「App Store 審核中」／`.ios-badge.review` 的徽章已過時，改回「iOS 準備中」/預設 `.ios-badge`（RIP 確認用這個文字，不特別強調曾被拒過）。其餘 RoadGuard、SnapPuzzle、Singlo、PixZap、Chronlo、Spendlo、Jotlo、Filelo、Cliplo、Blackjack 核對後現況與網頁一致未變動。改完用本地 `python -m http.server`＋Playwright 截圖核對排版無跑版。 |
| v3.0 | 2026-08-08 | **全站用 asc CLI 逐一查證後大整理**：RIP 反映卡片標籤不一致、很多 App 沒做卡片，並提供 Google Play Console 首頁截圖列出當下 10 支 Android 正式版 App。用 `asc apps list --paginate` 抓出 ASC 全部 17 支 App，逐一 `asc status`＋`asc apps public view` 查證版本狀態與公開可查性，不沿用已過期的 memory 記錄。**查出兩個站上沒更新到的落差**：Cheatlo、Memorlo 其實 iOS 早已通過審核上架，但站上還放在「即將推出」，已搬移至「已上架」。**修正三個錯誤/缺漏**：Blackjack Trainer Pro iOS 狀態其實是 `REJECTED`（模擬賭博政策退件已確定放棄，不會再送審），移除卡片上錯誤的「App Store 審核中」徽章，改回純 Google Play 單卡；Singlo 漏放 Google Play 徽章（Android 明明已是正式版），補上；PixZap、PetSoul 的 iOS 其實都已送審（`IN_REVIEW`／`WAITING_FOR_REVIEW`），原本卡片完全沒標示，補上「App Store 審核中」徽章。**新增 4 張卡片**（即將推出）：Scriblo、Readlo、Tracklo（Android 封測中）、Warplo（無 Android 計畫，只放 iOS 徽章），icon 從各專案 `assets/store/icon_512x512.png` 或 iOS `AppIcon.appiconset` 用 Python PIL 縮成 180×180。**重新定義徽章語意**：「iOS 準備中」（尚未送審）vs「iOS 審核中」（已送審，沿用原本就存在但沒被用過的 `.ios-badge.review` CSS class）明確區分開，之前兩者混用；「即將推出」區 Android 徽章文字改成描述實際狀態（如「Android 測試中」），不再固定寫「審核中」。改完用本地 `python -m http.server`＋Playwright 截圖核對排版無跑版。同步更新 [[project_pixzap]]／[[project_vitalo]]／[[project_memorlo]] 三份過期的 memory 記錄。 |
| v2.5 | 2026-07-25～07-27 | Talklo（iOS 正式上架，App Store-only 單徽章卡片）、Singlo（iOS 審核通過先標示「即將上架」，確認 `READY_FOR_SALE` 且商店頁面可正常打開後才移入已上架）陸續補齊；Ticklo/Spendlo 卡片曾漏寫 `app app-dual` 完整 class 導致跑版，已修復（之後新增卡片養成跟既有卡片對照 class 的習慣）。 |
| v2.1 | 2026-07-23 | Ticklo、Spendlo iOS 正式上架，卡片移入已上架區塊；RoadGuard 改為雙平台正式連結卡片（Android＋iOS 皆為真連結）。 |
| v2.0 | 2026-07-15 | **改版支援雙平台**：首頁從純 Android 升級為 Android＋iOS 雙平台首頁，延續原本奶油底＋橘色點綴的視覺，新增真實 App icon（180×180）與「iOS 準備中」藍灰徽章系統，跟 Google Play 橘色系刻意區分。 |
| v1.1 | 2026-06-30～07-10 | 新增四語輪播說明（繁中/EN/JP/KR，CSS 動畫每 3 秒切換）；新增「即將推出」分區；PixZap、SnapPuzzle、Jotlo、Cliplo、Filelo 陸續轉正式版移入已上架。 |
| v1.0 | 2026-06-17 | **首頁建立**：因應 Google Play「商店設定 → 網站」欄位同時被 AdMob 拿來抓 `app-ads.txt`、也會顯示給真實使用者點擊，做了這個 index.html 首頁跟 `app-ads.txt` 並存；暖色系（奶油底 #FFF8F0＋橘色點綴），初始卡片清單。 |
| v0.1 | 2026-06-16 | 新增 `app-ads.txt`（AdMob 收益驗證用）。 |
