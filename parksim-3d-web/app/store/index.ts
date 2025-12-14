import { create } from 'zustand';
import { parkingApi, adminApi } from '@/app/lib/api';

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

// Helper to generate spots dynamically
// Center (0) based, step 3
const generateSpots = (count: number): number[][] => {
    const spots: number[][] = [];
    // Start X: 
    // If count is 5, center is 2. (0,1,2,3,4)
    // 0: -6, 1: -3, 2: 0, 3: 3, 4: 6
    // Formula: (i - (count-1)/2) * 3
    for (let i = 0; i < count; i++) {
        const x = (i - (count - 1) / 2) * 3;
        spots.push([x, 0, -5]);
    }
    return spots;
};

const DEFAULT_CAPACITY = 5;

interface CarState {
  // Config
  capacity: number;
  setCapacity: (n: number) => void;
  syncPolicy: () => Promise<void>;

  // Input for new car
  plateNumber: string; 
  setPlateNumber: (plate: string) => void;
  
  // Active cars in scene
  cars: CarInstance[];
  parkingSpots: number[][]; // Coordinates of spots
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

export const useParkingStore = create<ParkingStore>((set, get) => ({
  // Car State
  capacity: DEFAULT_CAPACITY,
  parkingSpots: generateSpots(DEFAULT_CAPACITY),
  
  setCapacity: (n) => set({ 
      capacity: n,
      parkingSpots: generateSpots(n)
  }),

  syncPolicy: async () => {
      try {
          const policy = await adminApi.getPolicy();
          if (policy && policy.capacity) {
              const currentCapacity = get().capacity;
              if (currentCapacity !== policy.capacity) {
                  set({ 
                      capacity: policy.capacity,
                      parkingSpots: generateSpots(policy.capacity)
                  });
              }
          }
      } catch (e) {
          // Silent fail or log
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
      // Find occupied spots
      const occupiedIndices = cars
          .filter(c => c.status !== 'EXITING' && c.parkingSpotIndex !== undefined)
          .map(c => c.parkingSpotIndex);
      
      // Find first free spot
      const freeIndex = parkingSpots.findIndex((_, i) => !occupiedIndices.includes(i));
      return freeIndex;
  },

  spawnCar: () => {
      const { plateNumber, cars, addCar, setPlateNumber, getFreeSpotIndex, addLog } = get();
      
      // Check capacity
      const spotIndex = getFreeSpotIndex();
      if (spotIndex === -1) {
          addLog("Parking Lot Full! Cannot spawn.");
          return;
      }

      let targetPlate = plateNumber;

      // Check if plate already exists in active cars
      const isDuplicate = cars.some(c => c.plateNumber === targetPlate && c.status !== 'IDLE');
      
      if (isDuplicate) {
          // Generate new random plate to avoid collision
          const prefix = Math.floor(10 + Math.random() * 90);
          const suffix = Math.floor(1000 + Math.random() * 9000);
          targetPlate = `${prefix}가${suffix}`;
          setPlateNumber(targetPlate); // Update UI input as well
      }

      const newCar: CarInstance = {
          id: Math.random().toString(36).substr(2, 9),
          plateNumber: targetPlate,
          status: 'ENTERING',
          position: [-5, 0, 10], // Start position (Aligned with Entry Gate X=-8)
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
      const { plateNumber, addLog, setEntryGate } = get();
      const targetPlate = plate || plateNumber;
      
      addLog(`Requesting Entry for ${targetPlate}...`);
      try {
          const res = await parkingApi.entry(targetPlate);
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

      // Find car to get spot index
      const car = cars.find(c => c.plateNumber === targetPlate);
      const spotIndex = car?.parkingSpotIndex !== undefined ? car.parkingSpotIndex + 1 : 0;

      addLog(`Checking status for ${targetPlate}...`);
      try {
          // 1. Check Status
          const status = await parkingApi.checkStatus(targetPlate);
          addLog(`Fee: ${status.total_fee} KRW, Paid: ${status.is_paid}`);

          // Show Exit Receipt UI
          setExitInfo({
              plateNumber: targetPlate,
              duration: status.duration_minutes,
              parkingSpot: spotIndex,
              fee: status.total_fee,
              paymentMethod: status.total_fee > 0 ? "Credit Card" : "Free Pass",
              isVisible: true
          });

          // Wait a bit for UI to be seen before paying (Simulation effect)
          await new Promise(r => setTimeout(r, 1500));

          // 2. Pay if needed
          if (!status.is_paid && status.total_fee > 0) {
              addLog(`Paying ${status.total_fee}...`);
              await parkingApi.pay(targetPlate, status.total_fee);
              addLog("Payment Successful.");
          }

          // 3. Exit Request
          const res = await parkingApi.exit(targetPlate);
          if (res.gate_open) {
               addLog(`Exit Approved: ${res.message}`);
               setExitGate(true);
               
               // Hide UI after car leaves (Car.tsx handles animation duration)
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
}));
