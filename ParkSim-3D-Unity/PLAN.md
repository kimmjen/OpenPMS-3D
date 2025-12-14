# 🎮 ParkSim-3D-Unity 개발 계획 (Phase 3)

이 문서는 OpenPMS-3D의 고성능 클라이언트인 **ParkSim-3D-Unity**의 개발 계획을 다룹니다.

## 1. 개요 및 목표
Unity 엔진의 강력한 퍼포먼스를 활용하여 대규모 차량 시뮬레이션이 가능한 클라이언트를 구축합니다. `PMS-Core-Server`와 통신하며 실제 데이터를 시각화합니다.

- **목표**: Unity (C#) 기반의 주차 시뮬레이션 클라이언트 구현
- **우선순위**:
    1. Unity 프로젝트 스크립트 구조 설계 (Managers, Controllers)
    2. HTTP 통신 모듈 구현 (`UnityWebRequest`)
    3. 차량 및 차단기 제어 로직 구현
    4. 3D 씬 구성 가이드 (사용자 직접 수행 필요)

## 2. 기술 스택 상세

| 구분 | 기술 | 설명 |
| :--- | :--- | :--- |
| **Engine** | Unity 2022.3 LTS+ | 안정적인 3D 엔진 |
| **Language** | C# | 스크립팅 언어 |
| **Network** | UnityWebRequest | REST API 통신 |
| **JSON** | JsonUtility | 데이터 직렬화/역직렬화 |
| **Async** | Coroutines / UniTask | 비동기 작업 처리 |

## 3. 디렉토리 구조 (Assets)

```
ParkSim-3D-Unity/
└── Assets/
    ├── Scripts/
    │   ├── Core/
    │   │   ├── NetworkManager.cs   # API 통신 담당
    │   │   └── SimulationManager.cs # 전체 시뮬레이션 흐름 관리
    │   ├── Controllers/
    │   │   ├── CarController.cs    # 차량 이동 및 로직
    │   │   └── GateController.cs   # 차단기 애니메이션
    │   └── Models/
    │       └── DTOs.cs             # 데이터 모델 (API 응답)
    ├── Prefabs/ (사용자 생성)
    │   ├── Car.prefab
    │   └── Gate.prefab
    └── Scenes/
        └── MainScene.unity
```

## 4. 단계별 구현 로드맵

### Step 1: 프로젝트 스크립트 구조화
*   [ ] C# 스크립트 디렉토리 생성
*   [ ] 데이터 모델(`DTOs.cs`) 정의 (Server 스키마와 일치)

### Step 2: 네트워크 모듈 구현
*   [ ] `NetworkManager`: Singleton 패턴으로 구현. `Entry`, `Exit`, `Payment` API 메서드 작성.
*   [ ] `UnityWebRequest`를 사용한 비동기 통신 (Coroutine).

### Step 3: 오브젝트 컨트롤러 구현
*   [ ] `GateController`: `Open()`, `Close()` 메서드 및 회전 로직.
*   [ ] `CarController`: Waypoint 기반 이동 로직 및 상태 머신(Idle -> Approach -> Park -> Exit).

### Step 4: 시뮬레이션 매니저 통합
*   [ ] `SimulationManager`: UI 버튼 이벤트와 컨트롤러 연결. 시나리오(입차, 출차) 실행.

---
**Note**: Unity 에디터(GUI) 작업(오브젝트 배치, 컴포넌트 연결 등)은 스크립트 작성 후 사용자가 직접 수행해야 합니다. 이 문서는 **스크립트 코드** 제공에 중점을 둡니다.
