import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { parkingApi, adminApi, mapApi, MapConfig } from '@/app/lib/api';

export interface CarInstance {
    id: string;
    plateNumber: string;
    status: 'ENTERING' | 'PARKED' | 'EXITING' | 'IDLE';
    position: [number, number, number];
    parkingSpotIndex?: number; // Assigned spot index
}

interface ExitInfo {
    plateNumber: string;
    duration: number; // minutes
    parkingSpot: number; // 1-based index
    fee: number;
    paymentMethod: string;
    isVisible: boolean;
}

interface CarState {
    // Map Config
    currentMapId: string;
    mapConfig: MapConfig | null;
    loadMap: (mapId: string) => Promise<void>;

    // Config (Legacy support, syncs with map)
    capacity: number;
    setCapacity: (n: number) => void;
    syncPolicy: () => Promise<void>;

    // Input for new car
    plateNumber: string;
    setPlateNumber: (plate: string) => void;

    // Active cars in scene
    cars: CarInstance[];
    parkingSpots: number[][]; // Coordinates from MapConfig
    addCar: (car: CarInstance) => void;
    updateCarStatus: (id: string, status: CarInstance['status']) => void;
    removeCar: (id: string) => void;
    getFreeSpotIndex: () => number;

    // Exit Receipt Info
    exitInfo: ExitInfo | null;
    setExitInfo: (info: ExitInfo | null) => void;

    // Actions
    spawnCar: () => void;
    requestEntry: (plate?: string) => Promise<boolean>;
    requestExitProcess: (plate?: string) => Promise<boolean>;
}

interface GateState {
    entryGateOpen: boolean;
    exitGateOpen: boolean;
    setEntryGate: (isOpen: boolean) => void;
    setExitGate: (isOpen: boolean) => void;
}

interface ParkingStore extends CarState, GateState {
    logs: string[];
    addLog: (msg: string) => void;
}

export const useParkingStore = create<ParkingStore>()(
    persist(
        (set, get) => ({
            // Map State
            currentMapId: 'standard',
            mapConfig: null,

            // Car State
            capacity: 5,
            parkingSpots: [], // Loaded from MapConfig

            loadMap: async (mapId) => {
                try {
                    const config = await mapApi.getDetail(mapId);

                    // 1. Set Map Config
                    set({
                        currentMapId: mapId,
                        mapConfig: config,
                        parkingSpots: config.spots.sort((a, b) => a.spot_index - b.spot_index).map(s => [s.x, s.y, s.z]),
                        capacity: config.capacity,
                        cars: [] // Clear cars first
                    });
                    get().addLog(`Map Loaded: ${config.name}`);

                    // 2. Restore Active Cars
                    const activeEvents = await parkingApi.getActiveEvents(mapId);
                    if (activeEvents.length > 0) {
                        get().addLog(`Restoring ${activeEvents.length} parked cars...`);

                        const recoveredCars: CarInstance[] = [];
                        const { parkingSpots } = get();

                        activeEvents.forEach((event, i) => {
                            const occupiedIndices = recoveredCars.map(c => c.parkingSpotIndex!);
                            const freeIndex = parkingSpots.findIndex((_, idx) => !occupiedIndices.includes(idx));

                            if (freeIndex !== -1) {
                                const spot = parkingSpots[freeIndex];
                                recoveredCars.push({
                                    id: `recovered-${event.plate_number}`,
                                    plateNumber: event.plate_number,
                                    status: 'PARKED',
                                    position: [spot[0], spot[1], spot[2]],
                                    parkingSpotIndex: freeIndex
                                });
                            }
                        });

                        set({ cars: recoveredCars });
                    }

                } catch (e) {
                    console.error("Failed to load map/cars", e);
                    get().addLog("Error loading map or cars");
                }
            },

            setCapacity: (n) => set({ capacity: n }),

            syncPolicy: async () => {
                try {
                    const policy = await adminApi.getPolicy();
                } catch (e) {
                    console.log("Policy sync skipped");
                }
            },

            plateNumber: "12가3456",
            setPlateNumber: (plate) => set({ plateNumber: plate }),

            cars: [],

            addCar: (car) => set((state) => ({ cars: [...state.cars, car] })),

            updateCarStatus: (id, status) => set((state) => ({
                cars: state.cars.map((c) => c.id === id ? { ...c, status } : c)
            })),

            removeCar: (id) => set((state) => ({ cars: state.cars.filter((c) => c.id !== id) })),

            getFreeSpotIndex: () => {
                const { cars, parkingSpots } = get();
                const occupiedIndices = cars
                    .filter(c => c.status !== 'EXITING' && c.parkingSpotIndex !== undefined)
                    .map(c => c.parkingSpotIndex);

                const freeIndex = parkingSpots.findIndex((_, i) => !occupiedIndices.includes(i));
                return freeIndex;
            },

            spawnCar: () => {
                const { plateNumber, cars, addCar, setPlateNumber, getFreeSpotIndex, addLog, mapConfig } = get();

                if (!mapConfig) {
                    addLog("Map is loading...");
                    return;
                }

                // Check capacity
                const spotIndex = getFreeSpotIndex();
                if (spotIndex === -1) {
                    addLog("Parking Lot Full! Cannot spawn.");
                    return;
                }

                let targetPlate = plateNumber;
                const isDuplicate = cars.some(c => c.plateNumber === targetPlate && c.status !== 'IDLE');

                if (isDuplicate) {
                    const prefix = Math.floor(10 + Math.random() * 90);
                    const suffix = Math.floor(1000 + Math.random() * 9000);
                    targetPlate = `${prefix}가${suffix}`;
                    setPlateNumber(targetPlate);
                }

                const startPos = mapConfig.misc_config.paths.entry_start;

                const newCar: CarInstance = {
                    id: Math.random().toString(36).substr(2, 9),
                    plateNumber: targetPlate,
                    status: 'ENTERING',
                    position: [startPos[0], startPos[1], startPos[2]],
                    parkingSpotIndex: spotIndex
                };
                addCar(newCar);
            },

            // Exit Receipt Info
            exitInfo: null,
            setExitInfo: (info) => set({ exitInfo: info }),

            // Gate State
            entryGateOpen: false,
            exitGateOpen: false,
            setEntryGate: (isOpen) => set({ entryGateOpen: isOpen }),
            setExitGate: (isOpen) => set({ exitGateOpen: isOpen }),

            // Logs
            logs: [],
            addLog: (msg) => set((state) => ({ logs: [msg, ...state.logs].slice(0, 10) })),

            // Async Actions
            requestEntry: async (plate?: string) => {
                const { plateNumber, addLog, setEntryGate, currentMapId } = get();
                const targetPlate = plate || plateNumber;

                addLog(`Requesting Entry for ${targetPlate}...`);
                try {
                    const res = await parkingApi.entry(targetPlate, currentMapId);
                    if (res.gate_open) {
                        addLog(`Entry Approved: ${res.message}`);
                        setEntryGate(true);
                        return true;
                    } else {
                        addLog(`Entry Denied: ${res.message}`);
                        return false;
                    }
                } catch (e: any) {
                    addLog(`Error: ${e.response?.data?.detail || e.message}`);
                    return false;
                }
            },

            requestExitProcess: async (plate?: string) => {
                const { plateNumber, addLog, setExitGate, setExitInfo, cars } = get();
                const targetPlate = plate || plateNumber;

                const car = cars.find(c => c.plateNumber === targetPlate);
                const spotIndex = car?.parkingSpotIndex !== undefined ? car.parkingSpotIndex + 1 : 0;

                addLog(`Checking status for ${targetPlate}...`);
                try {
                    const status = await parkingApi.checkStatus(targetPlate);
                    addLog(`Fee: ${status.total_fee} KRW, Paid: ${status.is_paid}`);

                    setExitInfo({
                        plateNumber: targetPlate,
                        duration: status.duration_minutes,
                        parkingSpot: spotIndex,
                        fee: status.total_fee,
                        paymentMethod: status.total_fee > 0 ? "Credit Card" : "Free Pass",
                        isVisible: true
                    });

                    await new Promise(r => setTimeout(r, 1500));

                    if (!status.is_paid && status.total_fee > 0) {
                        addLog(`Paying ${status.total_fee}...`);
                        await parkingApi.pay(targetPlate, status.total_fee);
                        addLog("Payment Successful.");
                    }

                    const res = await parkingApi.exit(targetPlate);
                    if (res.gate_open) {
                        addLog(`Exit Approved: ${res.message}`);
                        setExitGate(true);

                        setTimeout(() => setExitInfo(null), 5000);

                        return true;
                    } else {
                        addLog(`Exit Denied: ${res.message}`);
                        setExitInfo(null);
                        return false;
                    }

                } catch (e: any) {
                    addLog(`Error: ${e.response?.data?.detail || e.message}`);
                    return false;
                }
            }
        }),
        {
            name: 'openpms-storage',
            partialize: (state) => ({ currentMapId: state.currentMapId }),
        }
    )
);
