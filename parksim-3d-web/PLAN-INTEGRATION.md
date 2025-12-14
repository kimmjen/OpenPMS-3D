# 🌐 ParkSim-3D-Web 개발 계획 (Phase 2 - Integration)

이 문서는 Web Client와 Core Server 간의 API 연동 계획을 다룹니다.

## 1. 개요
현재 독립적으로 동작하는 3D 시뮬레이션 로직을 `PMS-Core-Server`의 실제 API와 연동하여, 데이터 기반의 시뮬레이션을 완성합니다.

## 2. 연동 시나리오

### 입차 (Entry)
1.  차량이 입구(`Gate`) 앞에 도착.
2.  Web Client -> `POST /api/v1/parking/entry` 요청 (차량번호 전송).
3.  Server 응답 (성공/실패).
4.  성공 시: `Gate` 열림 -> 차량 주차.
5.  실패 시(예: 만차, 이미 주차중): `Gate` 유지, 경고 메시지 표시.

### 출차 (Exit)
1.  차량이 출구(`Gate`) 앞에 도착.
2.  Web Client -> `GET /api/v1/parking/status/{plate}` 요청 (요금 조회).
3.  요금이 `0`이거나 `is_paid`가 `True`이면 출차 진행.
4.  요금이 있다면:
    *   Web Client -> `POST /api/v1/parking/payment` (결제 시뮬레이션).
    *   결제 성공 후 -> `POST /api/v1/parking/exit` (출차 요청).
5.  Server 응답에 따라 `Gate` 열림 -> 차량 퇴장.

## 3. 구현 상세
*   **Server Config**: CORS 설정에 `http://localhost:3000` 추가.
*   **Web Lib**: `axios` 인스턴스 생성 (`api.ts`).
*   **Web Store**: `zustand` 스토어에 비동기 액션(`entryVehicle`, `payAndExit`) 추가.
*   **Web Component**: `Car.tsx` 내 `anime.js` 콜백에서 스토어 액션 호출.

---
이 문서는 프로젝트 진행 상황에 따라 지속적으로 업데이트됩니다.
