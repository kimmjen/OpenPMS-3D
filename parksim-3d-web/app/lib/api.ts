import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface EntryResponse {
    event_id: number;
    plate_number: string;
    entry_time: string;
    gate_open: boolean;
    message: string;
}

export interface PaymentResponse {
    success: boolean;
    message: string;
}

export interface ExitResponse {
    gate_open: boolean;
    message: string;
}

export interface ParkingStatus {
    total_fee: number;
    is_paid: boolean;
    duration_minutes: number;
}

export const parkingApi = {
    entry: async (plate_number: string, map_id: string = "standard"): Promise<EntryResponse> => {
        const res = await api.post<EntryResponse>('/parking/entry', { plate_number, map_id });
        return res.data;
    },

    checkStatus: async (plate_number: string): Promise<ParkingStatus> => {
        const res = await api.get<any>(`/parking/status/${plate_number}`);
        return res.data;
    },

    pay: async (plate_number: string, amount: number): Promise<PaymentResponse> => {
        const res = await api.post<PaymentResponse>('/parking/payment', {
            plate_number,
            amount,
            payment_method: 'CARD'
        });
        return res.data;
    },

    exit: async (plate_number: string): Promise<ExitResponse> => {
        const res = await api.post<ExitResponse>('/parking/exit', { plate_number });
        return res.data;
    },

    getActiveEvents: async (mapId?: string): Promise<ActiveEvent[]> => {
        const res = await api.get<ActiveEvent[]>('/parking/events/active', { params: { map_id: mapId } });
        return res.data;
    }
};

export interface ActiveEvent {
    plate_number: string;
    map_id: string;
    entry_time: string;
}

export const adminApi = {
    getStatus: async () => {
        const res = await api.get('/admin/status');
        return res.data;
    },
    resetSystem: async () => {
        const res = await api.post('/admin/reset');
        return res.data;
    },
    forceExit: async (plate_number: string) => {
        const res = await api.delete(`/admin/vehicle/${plate_number}`);
        return res.data;
    },
    getPolicy: async () => {
        const res = await api.get('/admin/policy');
        return res.data;
    },
    updatePolicy: async (data: any) => {
        const res = await api.put('/admin/policy', data);
        return res.data;
    },
    updateEntryTime: async (eventId: number, newTime: string) => {
        const res = await api.patch(`/admin/event/${eventId}/entry-time?entry_time=${newTime}`);
        return res.data;
    },
    getHistory: async (mapId?: string, limit: number = 50) => {
        const params: any = { limit };
        if (mapId && mapId !== 'all') params.map_id = mapId;
        const res = await api.get('/admin/history', { params });
        return res.data;
    }
};

export interface GateItem {
    id: number;
    gate_type: string; // 'entry' | 'exit'
    label?: string;
    x: number;
    y: number;
    z: number;
}

export interface SpotItem {
    id: number;
    spot_index: number;
    x: number;
    y: number;
    z: number;
}

export interface MapConfig {
    map_id: string;
    name: string;
    description: string;
    capacity: number;
    // Pricing
    base_rate?: number;
    unit_minutes?: number;
    free_minutes?: number;
    max_daily_fee?: number;

    misc_config: any; // Camera, Paths
    gates: GateItem[];
    spots: SpotItem[];
}

export const mapApi = {
    getAll: async () => {
        const res = await api.get<MapConfig[]>('/maps');
        return res.data;
    },
    getDetail: async (id: string) => {
        const res = await api.get<MapConfig>(`/maps/${id}`);
        return res.data;
    },
    updateMap: async (id: string, data: Partial<MapConfig>) => {
        const res = await api.put<MapConfig>(`/maps/${id}`, data);
        return res.data;
    }
};
