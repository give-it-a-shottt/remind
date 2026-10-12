# Quiz Review Design System — Style Reference

> 차분한 쿨그레이 책상 위에 오렌지 형광펜 한 줄. 색은 "지금 눌러야 할 것"과 "정답/오답"에만 쓰고, 나머지는 조용하게.

**Theme:** light

개인 복습 문제(퀴즈) 사이트용 디자인 시스템입니다. **폰트 스타일 / 폰트 계층(여백) / 레이아웃 여백 / 라운드 / 브레이크포인트는 기존 문서와 100% 동일**하고, 바뀐 것은 **2장 컬러**와 새로 추가한 **7장 컴포넌트 & 퀴즈 UI**뿐입니다. 퀴즐렛(Quizlet)의 느낌 — 쿨그레이 캔버스 위 흰 카드, 단 하나의 채도 높은 브랜드 컬러, 장식용 파스텔 카테고리 카드, 옅고 넓은 그림자 — 을 참고했고 브랜드 컬러는 오렌지 계열입니다.

## 1. 폰트 스타일

### Font Family · `--font-sans`

- **기본:** Pretendard `(임시)`
- **폴백:** `'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', Roboto, 'Noto Sans KR', sans-serif`

### Text Styles (Figma 기준 · 확정)

폰트는 **Pretendard**이고, 굵기는 **Regular / Medium / SemiBold** 3가지만 정의되어 있습니다. 스타일 이름은 `{KR|EN}/{카테고리}/{굵기}/{크기}` 형식입니다 (예: `KR/Title/SemiBold/20`).

| 카테고리 | 크기 (px)              | 행간 | 굵기                        |
| -------- | ---------------------- | ---- | --------------------------- |
| Display  | 56 · 48 · 40 · 36 · 32 | 130% | Regular · Medium · SemiBold |
| Display  | 28                     | 140% | Regular · Medium · SemiBold |
| Headline | 32                     | 130% | Regular · Medium · SemiBold |
| Headline | 28 · 24 · 20 · 18 · 16 | 140% | Regular · Medium · SemiBold |
| Title    | 24 · 20 · 18 · 16      | 140% | Regular · Medium · SemiBold |
| Body     | 15 · 14 · 13 · 12      | 145% | Regular · Medium · SemiBold |
| Caption  | 13 · 12 · 11           | 145% | Regular · Medium · SemiBold |

**자간(Letter spacing)**: KR(한글) 스타일은 **-2.5%**, EN(영문) 스타일은 **0%**. CSS에서는 한글 `-0.025em`, 영문 `0`으로 적용합니다.

**행간 규칙** (위 표에서 도출): 크기 **32px 이상 → 130%**, **16~28px → 140%**, **15px 이하 → 145%**.

> Figma에는 `KR/Display/Redular/56`처럼 **"Redular"(오타)** 로 된 스타일 이름이 있습니다. 이 문서에서는 모두 `Regular`로 표기하며, Figma 쪽 이름도 수정하는 것을 권장합니다.

### Font Weight

| 이름     | 값  | 토큰                     | 용도               |
| -------- | --- | ------------------------ | ------------------ |
| Regular  | 400 | `--font-weight-regular`  | 설명 텍스트, 본문  |
| Medium   | 500 | `--font-weight-medium`   | 라벨               |
| SemiBold | 600 | `--font-weight-semibold` | 제목, 라벨 강조(D) |

### 텍스트 역할

| 역할               | 기본 굵기    | 설명                             |
| ------------------ | ------------ | -------------------------------- |
| 라벨 (Label)       | Medium 500   | 카테고리, 태그, 보조 식별 텍스트 |
| 제목 (Title)       | SemiBold 600 | 카드/섹션의 핵심 문구            |
| 설명 (Description) | Regular 400  | 제목을 보충하는 본문             |

## 2. 컬러

### 컬러 무드 (퀴즐렛 느낌 참고)

- 화면 바탕은 **살짝 푸른 쿨그레이 캔버스**, 그 위에 **흰 카드**가 떠 있는 2단 구조.
- 텍스트·아이콘은 순수 검정 대신 **네이비 기운의 차콜**을 써서 부드럽게.
- 채도 높은 색은 **브랜드 오렌지 하나뿐**. 정답·오답 같은 상태 컬러는 피드백 순간에만 등장.
- 과목별 파스텔은 **장식용 카테고리 배경**으로만 쓰고 버튼·입력창·내비에는 쓰지 않는다.

> 기존 Neutral(#111 · #505050 계열)은 퀴즐렛 느낌을 위해 쿨 네이비 계열로 교체했습니다. **토큰 이름·용도는 그대로**라 기존 코드는 값만 바뀝니다.

### Neutral

**text**

| 토큰              | 값        | 이전      | 용도                                 |
| ----------------- | --------- | --------- | ------------------------------------ |
| `--text-main`     | `#282E3E` | `#111111` | 문제 제목, 라벨, 점수 등 기본 텍스트 |
| `--text-sub`      | `#586380` | `#505050` | 설명, 해설 본문                      |
| `--text-sub-weak` | `#6B7390` | `#767676` | 날짜, 문제 수, 메타 정보             |
| `--text-disabled` | `#939BB4` | `#999999` | 비활성 텍스트, placeholder           |

**icon**

| 토큰              | 값        | 용도                  |
| ----------------- | --------- | --------------------- |
| `--icon-main`     | `#282E3E` | 기본 아이콘           |
| `--icon-inverse`  | `#FFFFFF` | 어두운·브랜드 배경 위 |
| `--icon-sub`      | `#586380` | 보조 아이콘           |
| `--icon-sub-weak` | `#939BB4` | 더 약한 보조 아이콘   |
| `--icon-disabled` | `#C3C8D6` | 비활성 아이콘         |

**line**

| 토큰             | 값        | 용도                                 |
| ---------------- | --------- | ------------------------------------ |
| `--line-light`   | `#EDEFF4` | 약한 구분선                          |
| `--line-regular` | `#D9DDE8` | 기본 구분선, 카드·보기·입력창 테두리 |
| `--line-black`   | `#282E3E` | 강조 테두리                          |

**bg**

| 토큰           | 값        | 용도                                           |
| -------------- | --------- | ---------------------------------------------- |
| `--bg-default` | `#FFFFFF` | 카드 표면, 모달, 입력창 (Surface Level 1)      |
| `--bg-light`   | `#F6F7FB` | **페이지 캔버스**, 섹션 배경 (Surface Level 0) |
| `--bg-regular` | `#EDEFF4` | 입력창·비활성 채움, 눌림 상태, 진행바 트랙     |

### Brand — Orange

| 이름           | 값        | 토큰                     | 역할                                                            |
| -------------- | --------- | ------------------------ | --------------------------------------------------------------- |
| Orange 50      | `#FFF4ED` | `--color-primary-soft`   | 브랜드 틴트 섹션, 선택된 보기 배경, 태그 배경 (Lilac Wash 역할) |
| Orange 100     | `#FFE4D1` | `--color-primary-100`    | 포커스 링 바깥 번짐, 호버 틴트                                  |
| Orange 300     | `#FFB07A` | `--color-primary-300`    | 비활성 브랜드 버튼, 진행바 지난 구간                            |
| **Orange 500** | `#FF6B1A` | `--color-primary`        | **브랜드 대표색** — 로고, 진행바, 포커스 링, 스트릭 아이콘      |
| Orange 600     | `#E8590C` | `--color-primary-strong` | **채움 버튼 배경**                                              |
| Orange 700     | `#C2410C` | `--color-primary-text`   | 흰 배경 위 링크·브랜드 텍스트, 버튼 눌림                        |

> **대비 주의**: 흰 글자 on `#E8590C` ≈ **3.6:1** (큰 글씨 기준만 통과). 버튼 라벨은 SemiBold로 쓰고, 접근성을 엄격히 맞추려면 버튼 배경을 `--color-primary-text`(#C2410C, 4.8:1)로 바꾸세요. 오렌지 500은 흰 글자를 올리지 않습니다(≈2.9:1).

### Feedback — 정답 / 오답 / 힌트

퀴즈 사이트 전용 상태 컬러입니다. 채점 결과가 나온 순간에만 씁니다.

| 상태 | 진한 색 (텍스트) | 기본 색 (아이콘·테두리) | 연한 배경 | 토큰 접두사         |
| ---- | ---------------- | ----------------------- | --------- | ------------------- |
| 정답 | `#057A55`        | `#12B76A`               | `#E8F8F1` | `--color-correct-*` |
| 오답 | `#C9283B`        | `#F04452`               | `#FDECEE` | `--color-wrong-*`   |
| 힌트 | `#8A6100`        | `#F5B300`               | `#FFF8E1` | `--color-hint-*`    |

- 오답은 **분홍기 도는 레드**로 잡아 브랜드 오렌지와 헷갈리지 않게 했습니다. 오답 표시에 오렌지를 쓰지 않습니다.
- 색만으로 구분하지 않고 항상 **아이콘(✓ / ✕)이나 텍스트**를 같이 붙입니다.

### Category Pastels — 과목 카드 (장식 전용)

퀴즐렛의 4색 피처 카드 느낌. 과목·덱(문제 묶음)을 구분하는 **큰 카드 배경에만** 씁니다.

| 이름     | 배경      | 진한 포인트 (아이콘·라벨) | 예시 과목          |
| -------- | --------- | ------------------------- | ------------------ |
| Sky      | `#DDF1FF` | `#1C6FB0`                 | 프론트엔드 / React |
| Mint     | `#DCF5E9` | `#1A7F57`                 | 백엔드 / FastAPI   |
| Lavender | `#E8E5FF` | `#5B4BC4`                 | 알고리즘 / 코테    |
| Pink     | `#FFE3EF` | `#B83A73`                 | CS / 면접 질문     |

- 오렌지 계열 파스텔은 일부러 넣지 않았습니다 (브랜드 틴트 `#FFF4ED`와 겹침).
- 파스텔 카드 위 콘텐츠는 **흰 패널(`--bg-default`)을 안에 깔고** 올립니다. 파스텔 위에 텍스트를 바로 길게 쓰지 않습니다.

### Elevation (그림자)

네이비 기운의 옅은 그림자 하나 계열만 씁니다. 겹쳐 쓰지 않습니다.

| 이름 | 값                                   | 토큰          | 용도                           |
| ---- | ------------------------------------ | ------------- | ------------------------------ |
| sm   | `0 2px 4px rgba(40, 46, 62, 0.08)`   | `--shadow-sm` | 버튼, 보기 카드 호버           |
| md   | `0 4px 16px rgba(40, 46, 62, 0.10)`  | `--shadow-md` | 헤더, 플래시카드, 떠 있는 카드 |
| lg   | `0 12px 32px rgba(40, 46, 62, 0.14)` | `--shadow-lg` | 모달, 결과 시트                |

### 컬러 규칙

- 페이지 바탕은 `--bg-light`(캔버스), 카드·모달은 `--bg-default`. 이 2단 구조가 기본입니다.
- 브랜드 강조 구역(오늘의 복습 배너 등)은 `--color-primary-soft` 섹션 배경 + 안쪽 흰 카드.
- 제목·라벨은 `--text-main`, 설명·해설은 `--text-sub`, 메타는 `--text-sub-weak`, 비활성은 `--text-disabled`.
- 구분선은 `--line-light` / `--line-regular`, 강조 테두리만 `--line-black`. `--line-*`는 채움색으로 쓰지 않습니다.
- 오렌지는 **클릭 요소·진행 상태·포커스**에만. 큰 면적은 `--color-primary-soft`까지만 허용합니다.
- 한 화면에서 채도 높은 색은 오렌지 + (채점 직후) 정답/오답 색까지만.

## 3. 폰트 계층 & 여백

각 스케일은 **6단계**이며, 값은 모두 px입니다.
**여백 표기 `a / b`** = 라벨↔제목 간격 / 제목↔설명 간격으로 정의합니다. `(해석 — 의도와 다르면 수정)`

### A. 기본 (Default)

| 단계 | 라벨 (M) | 제목 (SB) | 설명 (R) | 여백   |
| ---- | -------- | --------- | -------- | ------ |
| 1    | 13       | 16        | 14       | 4 / 8  |
| 2    | 14       | 18        | 14       | 4 / 8  |
| 3    | 14       | 20        | 14       | 4 / 8  |
| 4    | 14       | 24        | 15       | 4 / 12 |
| 5    | 15       | 28        | 16       | 4 / 12 |
| 6    | 16       | 32        | 16       | 4 / 12 |

### B. 컴팩트 (Compact) — 작은 카드, 리스트용

| 단계 | 라벨 (M) | 제목 (SB) | 설명 (R) | 여백  |
| ---- | -------- | --------- | -------- | ----- |
| 1    | 11       | 14        | 12       | 4 / 6 |
| 2    | 12       | 16        | 12       | 4 / 6 |
| 3    | 12       | 18        | 13       | 4 / 8 |
| 4    | 13       | 20        | 13       | 4 / 8 |
| 5    | 13       | 20        | 14       | 4 / 8 |
| 6    | 14       | 24        | 14       | 4 / 8 |

### C. 확장 (Expanded) — 웹 배너, 히어로 영역용

| 단계 | 라벨 (M) | 제목 (SB) | 설명 (R) | 여백    |
| ---- | -------- | --------- | -------- | ------- |
| 1    | 14       | 24        | 16       | 8 / 12  |
| 2    | 14       | 28        | 16       | 8 / 12  |
| 3    | 16       | 32        | 18       | 8 / 16  |
| 4    | 16       | 40        | 18       | 8 / 16  |
| 5    | 18       | 48        | 20       | 12 / 20 |
| 6    | 18       | 56        | 20       | 12 / 20 |

### D. 강조 (Emphasis) — 굵기만 다른 버전

A와 **크기·여백·제목 굵기가 동일**하고 라벨 굵기만 올린 버전. 프로모션, 이벤트처럼 강조가 더 필요한 화면에 사용.

| 역할 | A 굵기       | D 굵기                  |
| ---- | ------------ | ----------------------- |
| 라벨 | Medium 500   | SemiBold 600            |
| 제목 | SemiBold 600 | SemiBold 600 (A와 동일) |
| 설명 | Regular 400  | Regular 400 (유지)      |

### 스케일 선택 가이드

| 상황                          | 스케일                     |
| ----------------------------- | -------------------------- |
| 일반 화면, 기본 카드          | A                          |
| 작은 카드, 리스트 아이템      | B                          |
| 웹 배너, 히어로               | C                          |
| 프로모션, 이벤트 등 강조 필요 | D (A 크기 + 라벨 SemiBold) |

### Do

- 한 화면(한 컴포넌트) 안에서는 **스케일을 섞지 않고 하나만** 쓴다.
- 같은 컴포넌트 안에서는 라벨·제목·설명을 **같은 단계 번호**로 맞춘다.
- 텍스트 간 여백은 스케일 표의 값만 사용한다 (4 / 6 / 8 / 12 / 16 / 20). 컴팩트의 `6`은 **텍스트 간격 전용 예외**이며, 레이아웃 여백은 4배수 규칙(4장)을 따른다.

### Don't

- 표에 없는 폰트 크기를 임의로 쓰지 않는다.
- 설명 텍스트를 Medium 이상으로 굵게 만들지 않는다 (D에서도 Regular 유지).
- 라벨과 제목 크기 순서를 뒤집지 않는다 (제목은 항상 라벨보다 크다).

## 4. 레이아웃 여백

### 기본 단위

레이아웃에 쓰는 모든 값(마진, 패딩, 간격, 크기)은 **4의 배수**를 사용합니다. (0, 4, 8, 12, 16, 20, 24, 28, 32 … 104)

> **예외**: 라벨·제목·설명 사이의 텍스트 간격은 3장 스케일 표를 따르며, 컴팩트의 `6px`처럼 4배수가 아닌 값을 허용합니다.

### 화면 좌우 마진

모바일 기준 화면 너비는 **390px**입니다 (360에서도 깨지지 않게 확인). 아래 마진은 모바일 기준이며, 태블릿·PC 마진은 6장 브레이크포인트를 따릅니다.

| 마진 | 토큰               | 비고                  |
| ---- | ------------------ | --------------------- |
| 16   | `--page-margin-sm` | 정보 밀도가 높은 화면 |
| 20   | `--page-margin-md` | **기본값**            |
| 24   | `--page-margin-lg` | 여유 있는 화면        |

필요하면 위 값에서 **±4 단위로 조절**합니다. 아래 4가지 타입의 섹션 간격도 같은 방식으로 ±4 조절이 가능합니다.

### 레이아웃 타입

| 타입                   | 구분 방식                         | 섹션 상단 → 타이틀 | 타이틀 → 콘텐츠 | 콘텐츠 → 다음 섹션             | 배경                                   |
| ---------------------- | --------------------------------- | ------------------ | --------------- | ------------------------------ | -------------------------------------- |
| Full UI 단 끊는 타입   | **12px 구분 띠** (`--bg-regular`) | 24 (띠 아래)       | 16              | 32 (띠 위)                     | `--bg-default`                         |
| Full UI 여백 활용 타입 | 여백만 사용 (띠 없음)             | 32 (배너 아래)     | 16              | 48                             | `--bg-default`                         |
| Card UI 전체 그룹      | 섹션 전체를 카드 1개로 묶음       | 24 (카드 안)       | 16              | 32 (카드 안 하단) + 카드 간 16 | 화면 `--bg-light`, 카드 `--bg-default` |
| Card UI 개별 그룹      | 콘텐츠마다 개별 카드              | 40 (섹션 간)       | 16              | 40                             | 화면 `--bg-light`, 카드 `--bg-default` |

- **Full UI 단 끊는 타입**: 코너 간 구분을 명확하게 보여줘서 정보 그룹핑에 좋음.
- **Full UI 여백 활용 타입**: 넓은 여백으로 구분해서 복잡한 콘텐츠를 여유 있게 배치.
- **Card UI 전체 그룹**: 섹션을 카드로 묶어 덩어리감을 만듦. 모듈화에 최적화.
- **Card UI 개별 그룹**: 콘텐츠 하나하나를 카드로 보여줘서 개별 항목을 강조.
- 카드 구분은 그림자 또는 `--line-regular` 테두리 중 스타일에 맞게 선택합니다.

### 여백 밀도

화면 성격에 따라 여백을 촘촘하게 ~ 여유 있게 고릅니다. **항목별로 따로 골라서 섞어 써도 됩니다** (예: 타이틀→콘텐츠 16 + 섹션 간격 48).

| 항목                           | 촘촘 | 기본 | 여유 | 매우 여유 |
| ------------------------------ | ---- | ---- | ---- | --------- |
| 타이틀 → 콘텐츠                | 16   | 20   | 24   | —         |
| 페이지 상단 (헤더 → 첫 타이틀) | 24   | 32   | 40   | —         |
| 섹션 / 블록 간격               | 32   | 40   | 48   | 60        |

- **섹션 / 블록 간격**은 한 화면 안에서 같은 값으로 통일합니다.
- **매우 여유(60)**는 메인 홈처럼 큰 이미지 위주로 섹션을 크게 나누는 화면에 사용합니다.
- 위 레이아웃 타입 표의 값은 이 밀도 표 안에서 조절할 수 있습니다.

### Do

- 한 화면에서는 **레이아웃 타입을 하나만** 쓴다.
- 좌우 마진은 한 화면 안에서 통일한다.

### Don't

- 4배수가 아닌 값을 레이아웃 여백에 쓰지 않는다 (텍스트 간격 예외 제외).

## 5. 라운드

### 카드 안 썸네일 라운드

카드 안에 들어가는 썸네일의 라운드는 **카드 라운드 −2 또는 −4**로 잡습니다.

| 카드 라운드 | 썸네일 라운드 | 판정 |
| ----------- | ------------- | ---- |
| 16          | 12 ~ 14       | O    |
| 16          | 16            | X    |
| 16          | 20            | X    |

> 썸네일 라운드 14는 4배수 예외로 허용합니다 (−2 규칙).

### 카드 텍스트 마진

썸네일 라운드와 텍스트 사이의 시각적 불안감을 줄이기 위한 카드 안 텍스트 좌우 패딩입니다.

| 썸네일 배치        | 썸네일 안쪽 여백 | 텍스트 패딩  |
| ------------------ | ---------------- | ------------ |
| 꽉 참 (Full bleed) | 0                | 12 ~ 24 자유 |
| 안쪽 배치 (Inset)  | 4 ~ 16           | 20           |
| 안쪽 배치 (Inset)  | 20               | 24           |

**규칙**: 썸네일이 안쪽에 배치되면 텍스트 패딩은 **썸네일 여백보다 크게** (최소 20).

### 카드 없는 썸네일 라운드

카드 없이 썸네일 + 텍스트만 놓을 때, 썸네일 라운드가 커지면 텍스트를 살짝 안으로 들여서 둥근 모서리와 시각적으로 맞춥니다. **라운드 20부터는 6으로 고정**합니다.

| 썸네일 라운드 | 텍스트 들여쓰기 |
| ------------- | --------------- |
| 0 · 4 · 8     | 0               |
| 12            | 2               |
| 16            | 4               |
| 20 이상       | 6 (고정)        |

> 텍스트 들여쓰기 2 / 4 / 6은 시각 보정용 값이라 4배수 예외로 허용합니다.

## 6. 브레이크포인트 (Breakpoints)

화면 너비에 따라 레이아웃이 바뀌는 기준점입니다. CSS는 **모바일 퍼스트**(`min-width`)로 작성합니다. 작은 화면 스타일이 기본이고, 화면이 커질 때만 덮어씁니다.

### 피그마 시안 대지 (최우선 3개)

시안은 이 3개만 그립니다. 나머지 구간은 아래 규칙으로 늘어나거나 줄어듭니다.

| 대지   | 너비     | 용도                                                |
| ------ | -------- | --------------------------------------------------- |
| PC     | **1440** | 데스크톱 메인 기준. 시안 1순위                      |
| 태블릿 | **768**  | 모바일 ↔ PC 레이아웃 전환점 (아이패드 세로)         |
| 모바일 | **390**  | 모바일 메인 기준. **360**에서도 안 깨지는지 꼭 확인 |

### 코드 기준점

| 토큰  | 최소 너비 | 대표 화면                 | 레이아웃 변화                                               |
| ----- | --------- | ------------------------- | ----------------------------------------------------------- |
| —     | 0         | 일반 스마트폰 (360 ~ 440) | 1단, 햄버거 메뉴                                            |
| `sm`  | 640       | 폴더블 펼침, 폰 가로 모드 | 카드 2단 가능                                               |
| `md`  | 768       | 태블릿 세로 ★ 핵심 분기점 | 햄버거 → PC 메뉴 (메뉴 항목이 많으면 `lg`로 미룸), 카드 2단 |
| `lg`  | 1024      | 태블릿 가로, 소형 노트북  | 카드 3단                                                    |
| `xl`  | 1280      | 13인치 노트북             | **PC 레이아웃 최소 너비**, 카드 4단                         |
| `2xl` | 1440      | 데스크톱 메인             | 콘텐츠 너비 고정, 남는 공간은 좌우 여백                     |

### 구간별 레이아웃 `(임시)`

모든 값은 4배수 규칙(4장)을 따릅니다. 모바일 마진은 4장의 16 / 20 / 24 중 고른 값을 그대로 씁니다.

| 구간        | 좌우 마진 | 컬럼 | 거터 | 콘텐츠 너비                |
| ----------- | --------- | ---- | ---- | -------------------------- |
| 0 ~ 639     | 20 (기본) | 4    | 16   | 화면 − 40                  |
| 640 ~ 767   | 24        | 4    | 16   | 화면 − 48                  |
| 768 ~ 1023  | 32        | 8    | 24   | 화면 − 64                  |
| 1024 ~ 1279 | 40        | 12   | 24   | 화면 − 80                  |
| 1280 ~      | 40 (최소) | 12   | 24   | **최대 1200, 가운데 정렬** |

- 1280 − 40 × 2 = 1200이라, 1280부터 콘텐츠 너비가 1200으로 고정됩니다. 1440 시안에서는 좌우 여백이 120씩 됩니다.

### 와이드 모니터 (2560) 대응

- 시안을 따로 그리지 않습니다. 1440 시안의 콘텐츠 컨테이너에 `max-width` + `margin: 0 auto`만 적용합니다.
- **배경·띠 배너·히어로 이미지는 화면 끝까지(full-bleed)**, 텍스트·카드는 컨테이너 안에 둡니다.
- 2560에서 확인할 것: 배경 이미지가 늘어나거나 잘리지 않는지(`object-fit: cover`), 양옆 빈 공간이 어색하지 않은지.

### 반응형 타이포

폰트 크기는 3장 스케일 표 안에서만 바꿉니다. 구간이 작아지면 **단계 번호만 내립니다** (표에 없는 크기, `clamp()`로 만든 중간 크기는 쓰지 않음).

| 요소        | PC (1280~) | 태블릿 (768~) | 모바일 (~767) |
| ----------- | ---------- | ------------- | ------------- |
| 히어로 제목 | C-6 (56)   | C-4 (40)      | C-2 (28)      |
| 섹션 제목   | A-6 (32)   | A-5 (28)      | A-4 (24)      |
| 카드 제목   | A-3 (20)   | A-3 (20)      | A-2 (18)      |

> 위 매핑은 예시입니다. 화면마다 조정하되, 한 컴포넌트 안에서 스케일(A·B·C)은 섞지 않습니다.

### 참고: 주요 기기 너비 (CSS px)

| 너비        | 기기                               |
| ----------- | ---------------------------------- |
| 360         | 갤럭시 S 기본형                    |
| 375         | 아이폰 SE, mini                    |
| 390 ~ 393   | 아이폰 13 ~ 16 기본형              |
| 384         | 갤럭시 S 울트라                    |
| 430 ~ 440   | 아이폰 Pro Max                     |
| 600 ~ 700대 | 갤럭시 Z 폴드 펼침 (모델마다 다름) |
| 768 / 1024  | 아이패드 세로 / 가로               |

### 개발 전달 시 주의

- **Tailwind 기본 `2xl`은 1536px**입니다. 1440을 쓰려면 설정을 바꿔야 합니다.
  - v4: `@theme { --breakpoint-2xl: 90rem; }` (90rem = 1440px)
  - v3: `tailwind.config.js`의 `theme.extend.screens`에 `'2xl': '1440px'`
- **CSS 변수는 미디어쿼리 조건에 쓸 수 없습니다.** `@media (min-width: var(--bp-md))`는 동작하지 않으니 숫자를 직접 씁니다.
- 브레이크포인트 경계값(767 / 768, 1279 / 1280)에서 레이아웃이 한 번에 바뀌는지 확인합니다.

### Do

- 시안은 1440 / 768 / 390 세 개만 그리고, 나머지 구간은 브라우저 크기를 줄여 가며 확인한다.
- 모바일 퍼스트(`min-width`)로 작성한다.

### Don't

- 2560 같은 와이드 화면용 시안을 따로 만들지 않는다.
- 기기 이름 기준으로 분기하지 않는다 (기기는 계속 바뀌고, 기준은 너비).

## 7. 컴포넌트 & 퀴즈 UI

퀴즐렛의 컴포넌트 느낌을 이 시스템 규칙(3~6장)에 맞춰 옮긴 것입니다. 폰트 크기는 3장 스케일, 여백은 4배수, 카드 라운드는 5장의 `--radius-card`(16)를 그대로 따릅니다. 아래에서 새로 생기는 값은 **버튼·칩 등 컨트롤 전용 라운드**뿐입니다.

### 컨트롤 라운드 (신규)

| 토큰              | 값    | 대상                                   |
| ----------------- | ----- | -------------------------------------- |
| `--radius-pill`   | 999px | 채움/아웃라인 버튼, 검색창, 칩, 진행바 |
| `--radius-input`  | 8px   | 텍스트 입력창, 주관식 답 입력          |
| `--radius-choice` | 12px  | 객관식 보기 카드 (카드 16 − 4 규칙)    |

### 버튼

| 종류      | 배경                     | 글자 / 테두리                              | 크기 (높이 · 좌우 패딩) | 비고                     |
| --------- | ------------------------ | ------------------------------------------ | ----------------------- | ------------------------ |
| Primary   | `--color-primary-strong` | 흰색 SemiBold                              | 48 · 24 (sm: 40 · 20)   | 필(pill) 모양이 시그니처 |
| Secondary | 투명                     | `--color-primary-text` + 1px 오렌지 테두리 | 48 · 24                 | 보조 CTA                 |
| Neutral   | `--bg-default`           | `--text-main` + 1px `--line-regular`       | 40 · 16                 | 건너뛰기, 이전 문제      |
| Text Link | 없음                     | `--color-primary-text`, 호버 시 밑줄       | —                       | "해설 보기", "전체 보기" |

- 상태: hover → 한 단계 진하게 (`600 → 700`), pressed → `--shadow-sm` 제거, disabled → `--color-primary-300` 배경.
- 포커스: `outline: 2px solid var(--color-primary); outline-offset: 2px`.
- 버튼 라벨 크기는 Body 15 / 14 (Title 16도 가능) — 3장 표 안에서만.

### 객관식 보기 (Choice)

| 상태 | 배경                   | 테두리                               | 좌측 마커                |
| ---- | ---------------------- | ------------------------------------ | ------------------------ |
| 기본 | `--bg-default`         | 1px `--line-regular`                 | 번호 원 (`--bg-regular`) |
| 호버 | `--bg-light`           | 1px `--line-regular` + `--shadow-sm` | —                        |
| 선택 | `--color-primary-soft` | 2px `--color-primary`                | 번호 원 오렌지 채움      |
| 정답 | `--color-correct-bg`   | 2px `--color-correct`                | ✓ 아이콘                 |
| 오답 | `--color-wrong-bg`     | 2px `--color-wrong`                  | ✕ 아이콘                 |

- 패딩 16 · 20, 보기 간 간격 12, 라운드 `--radius-choice`(12).
- 테두리가 1px → 2px로 바뀔 때 레이아웃이 밀리지 않게 `outline` 또는 `box-shadow: inset`으로 처리합니다.

### 플래시카드

- `--bg-default` + `--shadow-md`, 라운드 `--radius-card`(16), 패딩 24.
- 앞면 문제: 스케일 C 또는 A (예: PC `C-2`, 모바일 `A-4`), 뒷면 해설: 같은 스케일의 설명 크기.
- 하단에 "다시 / 애매함 / 알았음" 3버튼 → 각각 오답 · 힌트 · 정답 연한 배경 + 진한 텍스트.

### 진행바 & 점수

- 진행바: 높이 8, 트랙 `--bg-regular`, 채움 `--color-primary`, 라운드 `--radius-pill`.
- 상단 "3 / 10" 같은 카운터는 Caption/Body Medium + `--text-sub-weak`.
- 결과 화면 점수: 스케일 C (큰 숫자) + 정답 수는 `--color-correct-text`, 오답 수는 `--color-wrong-text`.
- 연속 학습(스트릭) 아이콘만 `--color-primary`로 채색.

### 과목(덱) 카드 — 퀴즐렛 피처 카드 느낌

- 바탕: 카테고리 파스텔, 라운드 `--radius-card`(16), 패딩 20.
- 안쪽 흰 패널: 라운드 12 (카드 −4), 문제 미리보기·문제 수 표시.
- 제목: 스케일 A (SemiBold), 라벨(과목명): 카테고리 진한 포인트 색.

### 문제 세트 카드 (리스트용)

- `--bg-default`, 1px `--line-regular` 테두리 **또는** `--shadow-md` 중 하나, 라운드 16, 패딩 16.
- 텍스트는 스케일 B (컴팩트): 라벨 = 과목, 제목 = 세트 이름, 설명 = "문제 24개 · 3일 전 복습".
- 오답 개수 뱃지: `--color-wrong-bg` + `--color-wrong-text`, `--radius-pill`.

### 헤더 & 검색

- 헤더: `--bg-default`, 높이 56(모바일) / 64(PC), `--shadow-md`. 로고만 `--color-primary`.
- 검색창: `--bg-light` 배경, 테두리 없음, `--radius-pill`, placeholder `--text-disabled`, 포커스 시 1px `--color-primary` 테두리.

### Do

- 한 화면의 Primary 버튼은 **하나**만 둔다 (예: "제출하기", "다음 문제").
- 정답/오답은 색 + 아이콘 + 텍스트를 함께 보여준다.
- 파스텔 카드 안 콘텐츠는 흰 패널 위에 둔다.

### Don't

- 오렌지를 오답·경고 표시에 쓰지 않는다.
- 파스텔을 버튼·입력창·헤더에 쓰지 않는다.
- 그림자를 두 겹 이상 쌓지 않는다.
- 제목에 Bold(700)를 쓰지 않는다 — 이 시스템의 최대 굵기는 SemiBold 600.

## Quick Start

```css
:root {
  /* 폰트 */
  --font-sans:
    "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, "Segoe UI",
    Roboto, "Noto Sans KR", sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --ls: -0.025em; /* 한글 -2.5% (Figma) */

  /* 컬러 */
  /* Neutral — text */
  --text-main: #282e3e;
  --text-sub: #586380;
  --text-sub-weak: #6b7390;
  --text-disabled: #939bb4;
  /* Neutral — icon */
  --icon-main: #282e3e;
  --icon-inverse: #ffffff;
  --icon-sub: #586380;
  --icon-sub-weak: #939bb4;
  --icon-disabled: #c3c8d6;
  /* Neutral — line */
  --line-light: #edeff4;
  --line-regular: #d9dde8;
  --line-black: #282e3e;
  /* Neutral — bg */
  --bg-default: #ffffff;
  --bg-light: #f6f7fb; /* 페이지 캔버스 */
  --bg-regular: #edeff4;
  /* Brand — Orange */
  --color-primary-soft: #fff4ed;
  --color-primary-100: #ffe4d1;
  --color-primary-300: #ffb07a;
  --color-primary: #ff6b1a; /* 브랜드 대표색 */
  --color-primary-strong: #e8590c; /* 채움 버튼 */
  --color-primary-text: #c2410c; /* 링크·브랜드 텍스트 */
  /* Feedback */
  --color-correct-text: #057a55;
  --color-correct: #12b76a;
  --color-correct-bg: #e8f8f1;
  --color-wrong-text: #c9283b;
  --color-wrong: #f04452;
  --color-wrong-bg: #fdecee;
  --color-hint-text: #8a6100;
  --color-hint: #f5b300;
  --color-hint-bg: #fff8e1;
  /* Category pastels (장식 전용) */
  --cat-sky: #ddf1ff;
  --cat-sky-ink: #1c6fb0;
  --cat-mint: #dcf5e9;
  --cat-mint-ink: #1a7f57;
  --cat-lavender: #e8e5ff;
  --cat-lavender-ink: #5b4bc4;
  --cat-pink: #ffe3ef;
  --cat-pink-ink: #b83a73;
  /* Elevation */
  --shadow-sm: 0 2px 4px rgba(40, 46, 62, 0.08);
  --shadow-md: 0 4px 16px rgba(40, 46, 62, 0.1);
  --shadow-lg: 0 12px 32px rgba(40, 46, 62, 0.14);

  /* 기본 굵기 (A/B/C) */
  --label-weight: var(--font-weight-medium);
  --title-weight: var(--font-weight-semibold);
  --desc-weight: var(--font-weight-regular);

  /* 레이아웃 (4배수) */
  --page-margin-sm: 16px;
  --page-margin-md: 20px; /* 기본 */
  --page-margin-lg: 24px;
  --section-divider: 12px; /* Full UI 단 끊는 타입 구분 띠 */
  --title-to-content: 16px; /* 16 · 20 · 24 */
  --page-top: 32px; /* 24 · 32 · 40 */
  --section-gap: 40px; /* 32 · 40 · 48 · 60 */
  --card-gap: 16px; /* Card UI 전체 그룹 카드 간격 */

  /* 라운드 */
  --radius-card: 16px;
  --radius-thumb-in-card: 12px; /* 카드 라운드 -4 (또는 -2) */
  /* 컨트롤 라운드 (7장) */
  --radius-pill: 999px;
  --radius-input: 8px;
  --radius-choice: 12px;
}

/* 영문 텍스트는 자간 0 */
[lang="en"] {
  --ls: 0;
}

/* D. 강조: 굵기만 교체 */
[data-emphasis] {
  --label-weight: var(--font-weight-semibold);
}

/* A. 기본 (기본값) — 단계는 data-step="1~6"로 선택 */
[data-scale="default"][data-step="1"] {
  --label: 13px;
  --title: 16px;
  --desc: 14px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 8px;
}
[data-scale="default"][data-step="2"] {
  --label: 14px;
  --title: 18px;
  --desc: 14px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 8px;
}
[data-scale="default"][data-step="3"] {
  --label: 14px;
  --title: 20px;
  --desc: 14px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 8px;
}
[data-scale="default"][data-step="4"] {
  --label: 14px;
  --title: 24px;
  --desc: 15px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 12px;
}
[data-scale="default"][data-step="5"] {
  --label: 15px;
  --title: 28px;
  --desc: 16px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.4;
  --gap-1: 4px;
  --gap-2: 12px;
}
[data-scale="default"][data-step="6"] {
  --label: 16px;
  --title: 32px;
  --desc: 16px;
  --label-lh: 1.4;
  --title-lh: 1.3;
  --desc-lh: 1.4;
  --gap-1: 4px;
  --gap-2: 12px;
}

/* B. 컴팩트 */
[data-scale="compact"][data-step="1"] {
  --label: 11px;
  --title: 14px;
  --desc: 12px;
  --label-lh: 1.45;
  --title-lh: 1.45;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 6px;
}
[data-scale="compact"][data-step="2"] {
  --label: 12px;
  --title: 16px;
  --desc: 12px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 6px;
}
[data-scale="compact"][data-step="3"] {
  --label: 12px;
  --title: 18px;
  --desc: 13px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 8px;
}
[data-scale="compact"][data-step="4"] {
  --label: 13px;
  --title: 20px;
  --desc: 13px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 8px;
}
[data-scale="compact"][data-step="5"] {
  --label: 13px;
  --title: 20px;
  --desc: 14px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 8px;
}
[data-scale="compact"][data-step="6"] {
  --label: 14px;
  --title: 24px;
  --desc: 14px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 8px;
}

/* C. 확장 */
[data-scale="expanded"][data-step="1"] {
  --label: 14px;
  --title: 24px;
  --desc: 16px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.4;
  --gap-1: 8px;
  --gap-2: 12px;
}
[data-scale="expanded"][data-step="2"] {
  --label: 14px;
  --title: 28px;
  --desc: 16px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.4;
  --gap-1: 8px;
  --gap-2: 12px;
}
[data-scale="expanded"][data-step="3"] {
  --label: 16px;
  --title: 32px;
  --desc: 18px;
  --label-lh: 1.4;
  --title-lh: 1.3;
  --desc-lh: 1.4;
  --gap-1: 8px;
  --gap-2: 16px;
}
[data-scale="expanded"][data-step="4"] {
  --label: 16px;
  --title: 40px;
  --desc: 18px;
  --label-lh: 1.4;
  --title-lh: 1.3;
  --desc-lh: 1.4;
  --gap-1: 8px;
  --gap-2: 16px;
}
[data-scale="expanded"][data-step="5"] {
  --label: 18px;
  --title: 48px;
  --desc: 20px;
  --label-lh: 1.4;
  --title-lh: 1.3;
  --desc-lh: 1.4;
  --gap-1: 12px;
  --gap-2: 20px;
}
[data-scale="expanded"][data-step="6"] {
  --label: 18px;
  --title: 56px;
  --desc: 20px;
  --label-lh: 1.4;
  --title-lh: 1.3;
  --desc-lh: 1.4;
  --gap-1: 12px;
  --gap-2: 20px;
}

/* 사용 예: <div data-scale="default" data-step="3"> 또는 강조 시 data-emphasis 추가 */
.label {
  font: var(--label-weight) var(--label)/var(--label-lh) var(--font-sans);
  letter-spacing: var(--ls);
  color: var(--text-main);
  margin-bottom: var(--gap-1);
}
.title {
  font: var(--title-weight) var(--title)/var(--title-lh) var(--font-sans);
  letter-spacing: var(--ls);
  color: var(--text-main);
  margin-bottom: var(--gap-2);
}
.desc {
  font: var(--desc-weight) var(--desc)/var(--desc-lh) var(--font-sans);
  letter-spacing: var(--ls);
  color: var(--text-sub);
}

/* 6. 브레이크포인트 — 모바일 퍼스트, 미디어쿼리에는 var() 불가라 숫자 직접 입력 */
:root {
  --container-pad: 20px; /* 0 ~ 639 */
  --container-max: 1200px;
}
@media (min-width: 640px) {
  :root {
    --container-pad: 24px;
  }
}
@media (min-width: 768px) {
  :root {
    --container-pad: 32px;
  }
}
@media (min-width: 1024px) {
  :root {
    --container-pad: 40px;
  }
}
.container {
  box-sizing: content-box; /* 1200 + 좌우 40 = 1280부터 고정 */
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--container-pad);
}
```
