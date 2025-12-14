# 📋 PMS-Core-Server 개발 계획 (Phase 1)

이 문서는 OpenPMS-3D의 핵심 백엔드인 **PMS-Core-Server**의 개발 계획과 아키텍처 설계를 상세히 다룹니다.

## 1. 개요 및 목표
OpenPMS-3D의 "두뇌" 역할을 하는 서버로, 모든 비즈니스 로직(요금 계산, 입출차 처리, 재입차 방지 등)을 중앙에서 처리하고, 클라이언트(Web, Unity, Admin)에 일관된 데이터를 제공합니다.

- **목표**: FastAPI 기반의 고성능 비동기 API 서버 구축
- **우선순위**:
    1. 개발 환경 설정 및 프로젝트 구조 잡기
    2. 데이터베이스 모델링 및 ORM 연동 (SQLAlchemy)
    3. 핵심 REST API 구현 (입차, 출차, 요금 조회)
    4. 실시간 통신을 위한 WebSocket 환경 구성

## 2. 기술 스택 상세

| 구분 | 기술 | 설명 |
| :--- | :--- | :--- |
| **Language** | Python 3.10+ | 최신 문법 및 타입 힌트 활용 |
| **Framework** | FastAPI | 고성능, 비동기 지원, 자동 문서화 |
| **Server** | Uvicorn | ASGI 서버 |
| **Database** | PostgreSQL (Prod) / SQLite (Dev) | 관계형 데이터베이스 |
| **ORM** | SQLAlchemy (Async) | 비동기 DB 처리 |
| **Migration** | Alembic | DB 스키마 관리 및 마이그레이션 |
| **Testing** | Pytest | 단위 및 통합 테스트 |

## 3. 디렉토리 구조 (예정)

확장성과 유지보수를 고려한 모듈형 구조를 채택합니다.

```
PMS-Core-Server/
├── app/
│   ├── api/            # API 라우터 (v1)
│   │   ├── endpoints/  # 각 도메인별 엔드포인트 (vehicles, parking, admin)
│   │   └── api.py      # 라우터 통합
│   ├── core/           # 핵심 설정 (Config, Security, Exceptions)
│   ├── db/             # DB 세션 및 기본 클래스
│   ├── models/         # SQLAlchemy DB 모델 (Vehicles, ParkingEvents...)
│   ├── schemas/        # Pydantic 데이터 검증 스키마 (Request/Response)
│   ├── services/       # 비즈니스 로직 (요금 계산, 재입차 판독 등 복잡한 로직 분리)
│   └── main.py         # 애플리케이션 진입점
├── tests/              # 테스트 코드
├── alembic/            # DB 마이그레이션 스크립트
├── requirements.txt    # 의존성 목록
└── .env                # 환경 변수 (비공개)
```

## 4. 데이터베이스 모델링 계획 (Schema)

앞서 논의된 4개의 핵심 테이블을 구현합니다.

1.  **Vehicles (차량 정보)**
    *   `plate_number` (PK), `is_vip`, `memo`
2.  **Pricing_Policies (요금 정책)**
    *   `base_rate`, `free_minutes`, `re_entry_limit` 등
3.  **Parking_Events (입/출차 기록)**
    *   `entry_time`, `exit_time`, `parking_spot`, `is_parked`
4.  **Transactions (정산 기록)**
    *   `fee_calculated`, `fee_paid`, `payment_method`, `is_paid`

## 5. 단계별 구현 로드맵

### Step 1: 환경 설정 및 기본 골격 구축
*   [ ] Python 가상환경 설정 및 패키지 설치 (`requirements.txt`)
*   [ ] FastAPI `app/main.py` 생성 및 Hello World 테스트
*   [ ] 프로젝트 디렉토리 구조 생성

### Step 2: 데이터베이스 연동
*   [ ] SQLAlchemy 비동기 엔진 설정 (`app/db/session.py`)
*   [ ] 도메인 모델 정의 (`app/models/*`)
*   [ ] Alembic 초기화 및 마이그레이션 스크립트 생성

### Step 3: 핵심 API 개발 (MVP)
*   [ ] **입차 API**: `POST /api/v1/entry` (차량 번호판 수신, 이벤트 생성)
*   [ ] **출차/정산 API**:
    *   `GET /api/v1/parking/{plate_number}` (현재 요금 조회)
    *   `POST /api/v1/payment` (결제 처리)
    *   `POST /api/v1/exit` (출차 요청 및 차단기 제어 신호)

### Step 4: 비즈니스 로직 고도화
*   [ ] **ParkingService**: 요금 계산 알고리즘 구현 (할인 정책 반영)
*   [ ] **AntiPassbackService**: 재입차 제한 로직 구현

---
이 문서는 프로젝트 진행 상황에 따라 지속적으로 업데이트됩니다.
