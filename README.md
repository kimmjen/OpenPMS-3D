# 🅿️ OpenPMS-3D (Open-source Parking Management System 3D)

**OpenPMS-3D** is an open-source project that allows you to implement and experience the operating principles of an Intelligent Parking Management System (PMS) through software logic and 3D simulation, without the need for hardware.

This project is based on a 'Thin Client, Thick Server' architecture, providing powerful backend logic and diverse 3D clients (Web, Unity).

**OpenPMS-3D**는 하드웨어 없이 소프트웨어 로직과 3D 시뮬레이션을 통해 지능형 주차 관리 시스템(PMS)의 작동 원리를 구현하고 체험할 수 있는 오픈 소스 프로젝트입니다.
이 프로젝트는 'Thin Client, Thick Server' 아키텍처를 기반으로 하며, 강력한 백엔드 로직과 다양한 3D 클라이언트(Web, Unity)를 제공합니다.

---

## 🏗️ System Architecture & Tech Stack (시스템 아키텍처 및 기술 스택)

The project is modular, with each module having an independent role and tech stack.
이 프로젝트는 모듈형 구조로 구성되어 있으며, 각 모듈은 독립적인 역할과 기술 스택을 가집니다.

### 🔙 Backend (PMS-Core-Server)
*   **Language**: Python 3.10+
*   **Framework**: FastAPI (Async Support)
*   **Database**: SQLite (Default, `aiosqlite`), SQLAlchemy 2.0+ (Async ORM)
    *   👉 [Detailed Database Schema (데이터베이스 상세 스키마)](docs/DATABASE_SCHEMA.md)
    *   👉 [Local DB Setup & SQL Guide (로컬 DB 설정 및 SQL 가이드)](docs/LOCAL_DB_SETUP.md)
*   **Key Features**: Pricing Engine, Concurrency Control, Admin API, **Multi-Map Configuration Management**.
    *   *주요 기능: 요금 계산 엔진, 동시성 제어, 관리자 API, 멀티 맵 설정 관리.*

### 🌐 Frontend (ParkSim-3D-Web & Admin)
*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **3D Library**: React Three Fiber (R3F), @react-three/drei
*   **State Management**: Zustand (Client-Server Sync)
*   **UI/UX**: Tailwind CSS v4, Glassmorphism Design, Anime.js
*   **Key Features**: **Multi-Map Simulation (Lobby)**, Real-time 3D Rendering, Responsive Admin Dashboard.
    *   *주요 기능: 멀티 맵 시뮬레이션(Lobby), 실시간 3D 렌더링, 반응형 관리자 대시보드.*

---

## 🌟 Detailed Features (주요 기능 상세)

### 1. 🔙 PMS-Core-Server (Backend)
Acts as the core brain of the parking lot.
*   **Pricing Engine**: Precise calculation based on **Base Rate**, **Unit Time**, and **Free Time**. Includes **Daily Max Fee** logic.
*   **DB-Driven Map System**: Stores layout (coordinates, paths, gates) in DB (`map_configs`) for dynamic expansion.
*   **Admin API**: Real-time status monitoring, Force Exit, **System Reset** (`reset_db.py`), Time Manipulation for testing.

### 2. 🌐 ParkSim-3D-Web (Frontend Client)
Interface for users and admins to interact with the system.

#### A. 3D Parking Simulator
*   **Lobby Page**: Select from various maps (Standard, Gangnam, Mega Mall).
*   **Mega Scale Digital Twin**:
    *   **The Hyundai Seoul (Parc1)** Map: A mega-scale map with **1,400+ parking spots** based on real blueprints.
    *   **120x120** Scale with massive vertical island structures and precise pathing.
*   **Real-time Data Visualization**:
    *   **3D Floor Status Board**: Real-time observability of occupancy per floor (B3~B6).
    *   Syncs with DB (`parking_spots`) status for 1,400+ individual spots.
*   **Realistic Movement**: Defined paths for entry/exit animations, 3D Camera Presets (Top View, CCTV View).
*   **Control Panel**: Real-time occupancy monitoring and receipt overlay.

#### B. Admin Dashboard (`/admin`)
*   **Dashboard**: Real-time monitoring, Force Exit, Quick Pricing Presets.
*   **Map Management**: Edit Capacity, Name, and Description in real-time. Active Map switching.

---

## 🚀 Getting Started (시작하기)

### 1. PMS-Core-Server (Backend)
```bash
# 1. Install Dependencies
cd PMS-Core-Server
pip install -r requirements.txt

# 2. Initialize Database (includes Map Data Seeding)
python reset_db.py

# 3. Run Server
uvicorn app.main:app --reload
```
*   API Docs: `http://localhost:8000/docs`

### 2. ParkSim-3D-Web (Client)
```bash
# 1. Navigate to directory
cd parksim-3d-web

# 2. Install Dependencies
npm install

# 3. Run Dev Server
npm run dev
```
*   **Lobby**: `http://localhost:3000`
*   **Admin**: `http://localhost:3000/admin`

---

## 📝 License

This project is licensed under the MIT License.
