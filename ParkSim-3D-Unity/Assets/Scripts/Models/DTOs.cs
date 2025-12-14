using System;

namespace OpenPMS.Models
{
    [Serializable]
    public class EntryResponse
    {
        public int event_id;
        public string plate_number;
        public string entry_time;
        public bool gate_open;
        public string message;
    }

    [Serializable]
    public class ParkingStatusResponse
    {
        public string plate_number;
        public string entry_time;
        public int duration_minutes;
        public float base_fee;
        public float discount;
        public float total_fee;
        public bool is_paid;
        public string status;
    }

    [Serializable]
    public class PaymentResponse
    {
        public int transaction_id;
        public float paid_amount;
        public bool success;
        public string message;
    }

    [Serializable]
    public class ExitResponse
    {
        public string plate_number;
        public string exit_time;
        public bool gate_open;
        public string message;
    }

    // Requests
    [Serializable]
    public class EntryRequest
    {
        public string plate_number;
        public string entry_gate_id;
    }

    [Serializable]
    public class PaymentRequest
    {
        public string plate_number;
        public float amount;
        public string payment_method;
    }

    [Serializable]
    public class ExitRequest
    {
        public string plate_number;
        public string exit_gate_id;
    }
}
