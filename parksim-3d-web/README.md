# 🌐 ParkSim-3D-Web

**OpenPMS-3D**의 프론트엔드 클라이언트로, **Next.js**와 **React Three Fiber (R3F)**를 사용하여 웹 브라우저 상에서 실시간 3D 주차 시뮬레이션을 제공합니다. 또한 시스템 관리자를 위한 대시보드 기능도 포함하고 있습니다.

---

## ✨ Key Features (주요 기능)

### 1. 3D Simulation (실시간 시뮬레이션)
-   **Lobby & Multi-Map**:
    -   시작 페이지(Lobby)에서 다양한 주차장 맵(Standard, Gangnam 등)을 선택하여 진입.
    -   각 맵마다 고유한 레이아웃(게이트 위치, 경로)과 수용량 적용.
-   **Realistic Rendering**: Three.js 기반의 3D 주차장 환경 구현.
-   **Dynamic Animations**: `Anime.js`를 활용한 차량 진입/진출, 차단기 개폐 애니메이션.
-   **Live Updates**: 관리자 설정(Capacity 등)에 따라 주차면이 실시간으로 동적 생성/변경됨.
-   **Smart Logic**: 실제 주차장과 동일한 로직(만차 시 진입 불가, 무작위 출차 등) 구현.

### 2. Admin Dashboard (관리자 대시보드)
-   **Path**: `/admin`
-   **Dashboard Tab**:
    -   **Monitoring**: 실시간 주차 현황(차량 번호, 입차 시간, 점유율) 모니터링.
    -   **Pricing Policy**: 기본 요금, 무료 회차, 단위 시간, 일일 최대 요금 설정.
    -   **Presets**: 지역별(강남, 공영, 호텔 등) 요금 프리셋 제공.
    -   **Control**: 특정 차량 강제 출차(Force Exit), 시스템 리셋, 입차 시간 수정(테스트용).
-   **Map Management Tab**:
    -   등록된 모든 맵(Standard, Gangnam 등) 리스트 조회.
    -   각 맵의 **Capacity(수용량)**, 이름, 설명 수정 가능.

### 3. Control Panel (사용자 패널)
-   **Glassmorphism UI**: 세련된 다크 모드 오버레이 UI.
-   **Simulation Controls**: 차량 입차(Spawn), 출차(Exit) 버튼.
-   **Receipt System**: 출차 시 상세 요금 내역(주차 시간, 구역, 최종 요금) 영수증 출력.

---

## 🛠️ Tech Stack (기술 스택)

-   **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **3D Graphics**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animation**: [Anime.js](https://animejs.com/)
-   **HTTP Client**: Axios

---

## 🚀 Getting Started (시작하기)

### Prerequisites
-   Node.js 18.0.0 or later
-   Running `PMS-Core-Server` (Backend)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Pages
-   **Lobby Page**: `http://localhost:3000/` (Select Map)
-   **Simulation**: `http://localhost:3000/sim/[mapId]` (e.g., `/sim/standard`, `/sim/gangnam`)
-   **Admin Dashboard**: `http://localhost:3000/admin`

---

## 📂 Project Structure (폴더 구조)

```bash
parksim-3d-web/
├── app/
│   ├── admin/           # Admin Dashboard Page
│   ├── sim/             # Simulation Page ([mapId])
│   ├── components/
│   │   ├── canvas/      # 3D R3F Components (Scene, Car, Gate, ParkingLot)
│   │   └── ui/          # 2D UI Components (ControlPanel)
│   ├── lib/             # API Client (Axios)
│   ├── store/           # Global State (Zustand)
│   ├── layout.tsx       # Root Layout
│   └── page.tsx         # Lobby Page (Main)
├── public/              # Static Assets (Models, Textures)
└── tailwind.config.ts   # Tailwind Configuration
```

---

## 🔧 Configuration

`app/lib/api.ts` 파일에서 백엔드 API 주소를 설정할 수 있습니다.

```typescript
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Backend URL
  // ...
});
```
