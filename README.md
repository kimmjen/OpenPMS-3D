# 🅿️ OpenPMS-3D (Open-source Parking Management System 3D)

**OpenPMS-3D**는 하드웨어 없이 소프트웨어 로직과 3D 시뮬레이션을 통해 지능형 주차 관리 시스템(PMS)의 작동 원리를 구현하고 체험할 수 있는 오픈 소스 프로젝트입니다.

이 프로젝트는 'Thin Client, Thick Server' 아키텍처를 기반으로 하며, 강력한 백엔드 로직과 다양한 3D 클라이언트(Web, Unity)를 제공합니다.

---

## 🏗️ 시스템 아키텍처 및 기술 스택 (System Architecture & Tech Stack)

이 프로젝트는 모듈형 구조로 구성되어 있으며, 각 모듈은 독립적인 역할과 기술 스택을 가집니다.

### 🔙 Backend (PMS-Core-Server)
*   **Language**: Python 3.10+
*   **Framework**: FastAPI (비동기 처리 지원)
*   **Database**: SQLite (기본 설정, `aiosqlite`), SQLAlchemy 2.0+ (Async ORM)
*   **Key Features**: 요금 계산 엔진, 동시성 제어, 관리자 API, 데이터 영속성 관리.

### 🌐 Frontend (ParkSim-3D-Web & Admin)
*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **3D Library**: React Three Fiber (R3F), @react-three/drei
*   **State Management**: Zustand (Client-Server Sync)
*   **UI/UX**: Tailwind CSS v4, Glassmorphism Design, Anime.js
*   **Key Features**: 실시간 3D 시뮬레이션, 반응형 관리자 대시보드.

### 🎮 Simulation Client (ParkSim-3D-Unity)
*   **Engine**: Unity 2022.3+ (LTS)
*   **Language**: C#
*   **Networking**: UnityWebRequest
*   **Key Features**: 고성능 물리 엔진 기반 시뮬레이션 (Phase 4 예정).

---

## 🌟 주요 기능 상세 (Detailed Features)

### 1. 🔙 PMS-Core-Server (Backend)
주차장의 핵심 두뇌 역할을 수행합니다.

*   **주차 요금 계산 엔진 (Pricing Engine)**:
    *   **기본 요금(Base Rate)**, **단위 시간(Unit Time)**, **무료 회차(Free Time)** 설정을 기반으로 정밀한 요금 계산.
    *   **일일 최대 요금(Daily Max Fee)** 적용 로직 (예: 강남 지역 80,000원 상한).
    *   분 단위 주차 시간 계산 및 할인 정책 적용.
*   **입출차 트랜잭션 관리**:
    *   차량 번호판 인식(LPR) 시뮬레이션 엔드포인트 (`/entry`, `/exit`).
    *   동시 다발적인 입차 요청에 대한 **동시성 제어(Concurrency Control)** 및 중복 방지.
*   **관리자 제어 API (Admin API)**:
    *   실시간 주차 현황 조회 및 강제 출차(Force Exit).
    *   **시스템 초기화(Reset)**: 데이터베이스 완전 초기화 기능.
    *   **테스트용 시간 조작**: 입차 시간을 과거로 수정하여 고액 요금 테스트 가능.
    *   **동적 정책 반영**: 수용량(Capacity) 및 요금 정책 실시간 업데이트.

### 2. 🌐 ParkSim-3D-Web (Frontend Client)
사용자와 관리자가 시스템과 상호작용하는 인터페이스입니다.

#### A. 3D 주차 시뮬레이터 (Simulation)
*   **실시간 3D 렌더링**: WebGL 기반으로 주차장 환경을 브라우저에서 즉시 실행.
*   **동적 주차장 생성**: 관리자가 설정한 **Capacity(수용량)**에 따라 주차면 개수와 라인이 실시간으로 자동 변경.
*   **현실적인 차량 움직임**:
    *   입차: 게이트 오픈 -> 진입 -> 주차면 이동 (Anime.js 기반 부드러운 경로).
    *   출차: **무작위(Random) 출차** 시뮬레이션 (실제 주차장처럼 입차 순서와 무관하게 출차).
    *   게이트 제어: 차량 통과 시 자동으로 열리고 닫히는 애니메이션.
*   **Control Panel (대시보드)**:
    *   **Glassmorphism UI**: 세련된 반투명 다크 모드 디자인.
    *   실시간 점유율(Occupancy) 게이지 및 시스템 로그 모니터링.
    *   **영수증 오버레이(Receipt)**: 출차 시 주차 시간, 구역, 요금, 결제 수단이 명시된 영수증 팝업.

#### B. 관리자 대시보드 (Admin Dashboard)
*   **접속 주소**: `/admin`
*   **지역별 요금 프리셋 (Quick Presets)**:
    *   `Gangnam (Hotspot)`: 초고가 요금 (10분당 1,500원 / 일 최대 80,000원).
    *   `Public Parking`: 저렴한 공영 주차장 요금.
    *   `Standard`: 일반적인 요금제.
    *   `Premium/Hotel`: 호텔급 요금제.
*   **실시간 모니터링 및 제어**:
    *   현재 주차된 차량 리스트 및 점유율 확인.
    *   특정 차량 **강제 출차(Force Exit)**.
    *   **시간 수정(Edit Time)**: 입차 시간을 수정하여 장기 주차 시뮬레이션 가능.
*   **정책 설정 (Configuration)**:
    *   주차장 크기(Capacity) 조절 시 3D 화면 즉시 반영.
    *   요금 정책(기본료, 무료시간 등) 변경 시 즉시 서버 저장.

---

## 🚀 시작하기 (Getting Started)

### 1. PMS-Core-Server (Backend)
```bash
# 1. 의존성 설치
cd PMS-Core-Server
pip install -r requirements.txt

# 2. 데이터베이스 초기화 (최초 실행 또는 리셋 시)
python reset_db.py

# 3. 서버 실행
uvicorn app.main:app --reload
```
*   API 문서 (Swagger UI): `http://localhost:8000/docs`

### 2. ParkSim-3D-Web (Client)
```bash
# 1. 프로젝트 폴더로 이동
cd parksim-3d-web

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
```
*   **시뮬레이션**: `http://localhost:3000`
*   **관리자 페이지**: `http://localhost:3000/admin`

---

## 🗺️ 개발 로드맵 (Roadmap Status)

### Phase 1: 시스템 기초 (Core Foundation) ✅
- [x] Backend API & DB Modeling (FastAPI, SQLite)
- [x] Core Logic (Entry, Exit, Payment, Fee Calculation)
- [x] Concurrency Handling (Race Condition Prevention)

### Phase 2: 웹 클라이언트 MVP (Web Client) ✅
- [x] 3D Environment (R3F, Low-poly Models)
- [x] Dynamic Parking Spots (Capacity-based rendering)
- [x] Realistic Animations (Car pathing, Gate logic)
- [x] Interactive Control Panel (Dark UI, Receipts)

### Phase 3: 관리자 및 고도화 (Admin & Advanced) ✅
- [x] Admin Dashboard (Pricing Presets, Real-time Monitoring)
- [x] Testing Tools (Time Manipulation, Force Exit, System Reset)
- [x] Client-Server Sync (Polling Architecture)
- [x] Advanced Pricing Logic (Daily Max Fee, Region Presets)

### Phase 4: Unity 클라이언트 (Unity Client) 🚧
- [x] Basic Network Architecture
- [ ] Full 3D Implementation & Sync (Planned)

---

## 📂 디렉토리 구조

```bash
OpenPMS-3D/
├── PMS-Core-Server/     # Backend (FastAPI)
│   ├── app/
│   │   ├── api/         # Endpoints (Admin, Parking, Vehicles)
│   │   ├── models/      # Database Models
│   │   └── services/    # Parking Logic
│   ├── reset_db.py      # DB Reset Tool
│   └── pms.db           # SQLite Database
├── parksim-3d-web/      # Frontend (Next.js)
│   ├── app/
│   │   ├── admin/       # Admin Page
│   │   ├── components/  # 3D Components & UI
│   │   └── store/       # Zustand Store (Logic)
└── README.md
```

## 📝 License

This project is licensed under the MIT License.
