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
}

export const parkingApi = {
  entry: async (plate_number: string): Promise<EntryResponse> => {
    const res = await api.post<EntryResponse>('/parking/entry', { plate_number });
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
  }
};

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
    }
};
