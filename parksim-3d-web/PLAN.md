# 🌐 ParkSim-3D-Web 개발 계획 (Phase 2)

이 문서는 OpenPMS-3D의 웹 기반 3D 시뮬레이터인 **ParkSim-3D-Web**의 개발 계획을 다룹니다.

## 1. 개요 및 목표
사용자가 별도의 설치 없이 웹 브라우저를 통해 주차장 시스템을 3D로 체험할 수 있는 클라이언트입니다. `PMS-Core-Server`와 실시간으로 통신하며 입/출차 시나리오를 시각화합니다.

- **목표**: Next.js와 Three.js를 활용한 인터랙티브 3D 주차장 구현
- **우선순위**:
    1. Next.js 프로젝트 설정 및 3D 렌더링 환경 구축
    2. 주차장 기본 맵 (바닥, 주차선, 입출구) 모델링
    3. 차량 이동 및 애니메이션 구현 (Anime.js)
    4. 백엔드 API 연동 (입차/출차/정산)

## 2. 기술 스택 상세

| 구분 | 기술 | 설명 |
| :--- | :--- | :--- |
| **Framework** | Next.js 14+ (App Router) | React 기반 웹 프레임워크 |
| **Language** | TypeScript | 정적 타입 시스템 |
| **3D Engine** | Three.js / React Three Fiber (R3F) | React 선언형 3D 라이브러리 |
| **Helpers** | React Three Drei | R3F 유틸리티 (카메라, 컨트롤 등) |
| **Animation** | Anime.js | 부드러운 객체 이동 및 UI 애니메이션 |
| **Styling** | Tailwind CSS | UI 스타일링 |
| **State** | Zustand | 전역 상태 관리 (차량 위치, 정산 상태 등) |

## 3. 디렉토리 구조 (예정)

```
ParkSim-3D-Web/
├── app/
│   ├── page.tsx            # 메인 페이지 (3D 캔버스 포함)
│   ├── layout.tsx
│   └── components/
│       ├── ui/             # 2D 오버레이 UI (정산 키오스크 등)
│       └── canvas/         # 3D 컴포넌트
│           ├── Scene.tsx   # 메인 씬
│           ├── ParkingLot.tsx # 주차장 바닥/라인
│           ├── Car.tsx     # 차량 모델
│           ├── Gate.tsx    # 차단기 모델
│           └── Kiosk.tsx   # 정산기 모델
├── hooks/                  # 커스텀 훅 (API 통신 등)
├── store/                  # Zustand 스토어
├── lib/
│   ├── api.ts              # PMS-Core-Server API 클라이언트
│   └── anime.ts            # 애니메이션 유틸리티
└── public/                 # 텍스처, 3D 모델(GLB) 에셋
```

## 4. 단계별 구현 로드맵

### Step 1: 프로젝트 초기화
*   [ ] Next.js (TypeScript) 프로젝트 생성
*   [ ] 필수 라이브러리 설치 (`three`, `@react-three/fiber`, `@react-three/drei`, `animejs`, `axios`, `zustand`)
*   [ ] Tailwind CSS 설정

### Step 2: 3D 환경 기본 구축 (The World)
*   [ ] R3F `Canvas` 설정 및 기본 조명/카메라 배치
*   [ ] `ParkingLot` 컴포넌트: 주차 구역 바닥 및 라인 드로잉
*   [ ] `Gate` 컴포넌트: 입구/출구 차단기 바(Bar) 모델링 (Pivot 설정 중요)

### Step 3: 차량 및 애니메이션 (The Actor)
*   [ ] `Car` 컴포넌트: 단순한 박스 형태 또는 로우폴리 모델 렌더링
*   [ ] Anime.js 연동: 차량이 입구 -> 주차면 -> 출구로 이동하는 경로 애니메이션 구현

### Step 4: 서버 연동 및 시나리오 (The Logic)
*   [ ] 입차 시뮬레이션: 차량 진입 -> API `POST /entry` 요청 -> 성공 시 차단기 열림 -> 주차
*   [ ] 출차 시뮬레이션: 출차 요청 -> API `POST /exit` -> 미납 시 차단기 거부 -> 정산 후 출차

---
이 문서는 프로젝트 진행 상황에 따라 지속적으로 업데이트됩니다.
