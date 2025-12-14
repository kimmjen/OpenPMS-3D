# 🔙 PMS-Core-Server

**OpenPMS-3D**의 백엔드 서버로, 주차 관리 시스템의 핵심 비즈니스 로직(요금 계산, 입출차 제어, 데이터 관리)을 담당하는 **RESTful API** 서버입니다.

---

## ✨ Key Features (주요 기능)

### 1. Pricing Engine (요금 계산 엔진)
-   **Advanced Calculation**:
    -   `기본 요금` + `단위 요금` 방식의 시간제 요금 계산.
    -   **일일 최대 요금(Daily Max Fee)** 적용 (장기 주차 시 요금 폭탄 방지/적용).
    -   **무료 회차 시간(Free Time)** 자동 차감.
-   **Preset Support**: 지역별/유형별 요금 정책(강남, 공영 등)을 DB에 저장하고 적용.

### 2. Parking Logic (주차 로직)
-   **Entry (입차)**:
    -   만차(Full Capacity) 시 진입 거부.
    -   중복 입차 방지 (이미 주차된 차량 재진입 불가).
    -   동시성 제어(Concurrency Control)로 데이터 무결성 보장.
-   **Exit (출차)**:
    -   미납 요금 존재 시 출차 거부 (Gate 미개방).
    -   정산 완료 시 출차 처리 및 이력 저장.

### 3. Admin API (관리자 기능)
-   **Real-time Monitoring**: 현재 주차된 모든 차량 상태 조회.
-   **Control**:
    -   **강제 출차(Force Exit)**: 문제 차량 즉시 퇴거 처리.
    -   **시간 수정**: 시뮬레이션 테스트를 위해 입차 시간을 과거로 조작 가능.
    -   **System Reset**: DB 초기화 기능.

---

## 🛠️ Tech Stack (기술 스택)

-   **Language**: Python 3.10+
-   **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (High performance, easy to learn)
-   **Database**: SQLite (Development) / PostgreSQL (Production ready)
-   **ORM**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/) (AsyncIO Support)
-   **Schema**: Pydantic v2
-   **Server**: Uvicorn (ASGI)

---

## 🚀 Getting Started (시작하기)

### Prerequisites
-   Python 3.10 or higher

### Installation

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Initialize Database (Creates tables)
# Run this if pms.db does not exist or schema changed
python reset_db.py

# 3. Run Server
uvicorn app.main:app --reload
```

The server will start at `http://127.0.0.1:8000`.

### API Documentation
-   **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
-   **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📂 Project Structure (폴더 구조)

```bash
PMS-Core-Server/
├── app/
│   ├── api/             # API Router & Endpoints
│   │   ├── endpoints/   # parking.py, admin.py, vehicles.py
│   ├── core/            # Config & Settings
│   ├── db/              # Database Session & Base Models
│   ├── models/          # SQLAlchemy Models (DB Schema)
│   ├── schemas/         # Pydantic Models (Request/Response)
│   └── main.py          # App Entry Point
├── pms.db               # SQLite Database File
├── init_db.py           # DB Initialization Script
├── reset_db.py          # DB Reset Script (Drops & Creates Tables)
└── requirements.txt     # Python Dependencies
```

---

## 💾 Database Schema (주요 모델)

### `PricingPolicy`
요금 정책을 정의합니다.
-   `base_rate`: 기본 요금
-   `unit_minutes`: 단위 시간 (분)
-   `free_minutes`: 무료 회차 시간
-   `max_daily_fee`: 일일 최대 요금
-   `capacity`: 주차장 총 수용량

### `ParkingEvent`
차량의 입출차 이력을 기록합니다.
-   `entry_time`: 입차 시간
-   `exit_time`: 출차 시간
-   `is_parked`: 현재 주차 여부

### `Transaction`
결제 내역을 기록합니다.
-   `fee_calculated`: 계산된 총 요금
-   `fee_paid`: 실제 결제 금액
