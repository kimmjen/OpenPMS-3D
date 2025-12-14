using System;
using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;
using OpenPMS.Models;

namespace OpenPMS.Core
{
    public class NetworkManager : MonoBehaviour
    {
        public static NetworkManager Instance { get; private set; }

        private const string BASE_URL = "http://localhost:8000/api/v1";

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        public IEnumerator RequestEntry(string plateNumber, Action<bool, string> callback)
        {
            string url = $"{BASE_URL}/parking/entry";
            EntryRequest req = new EntryRequest { plate_number = plateNumber, entry_gate_id = "GATE-01" };
            string json = JsonUtility.ToJson(req);

            using (UnityWebRequest www = CreatePostRequest(url, json))
            {
                yield return www.SendWebRequest();

                if (www.result != UnityWebRequest.Result.Success)
                {
                    Debug.LogError($"Entry Error: {www.error} - {www.downloadHandler.text}");
                    callback?.Invoke(false, www.error);
                }
                else
                {
                    EntryResponse res = JsonUtility.FromJson<EntryResponse>(www.downloadHandler.text);
                    if (res.gate_open)
                        callback?.Invoke(true, res.message);
                    else
                        callback?.Invoke(false, res.message);
                }
            }
        }

        public IEnumerator CheckStatus(string plateNumber, Action<ParkingStatusResponse> callback)
        {
            string url = $"{BASE_URL}/parking/status/{plateNumber}";
            using (UnityWebRequest www = UnityWebRequest.Get(url))
            {
                yield return www.SendWebRequest();

                if (www.result != UnityWebRequest.Result.Success)
                {
                    Debug.LogError($"Status Error: {www.error}");
                    callback?.Invoke(null);
                }
                else
                {
                    ParkingStatusResponse res = JsonUtility.FromJson<ParkingStatusResponse>(www.downloadHandler.text);
                    callback?.Invoke(res);
                }
            }
        }

        public IEnumerator PayFee(string plateNumber, float amount, Action<bool> callback)
        {
            string url = $"{BASE_URL}/parking/payment";
            PaymentRequest req = new PaymentRequest 
            { 
                plate_number = plateNumber, 
                amount = amount, 
                payment_method = "CARD" 
            };
            string json = JsonUtility.ToJson(req);

            using (UnityWebRequest www = CreatePostRequest(url, json))
            {
                yield return www.SendWebRequest();

                if (www.result != UnityWebRequest.Result.Success)
                {
                    Debug.LogError($"Payment Error: {www.error}");
                    callback?.Invoke(false);
                }
                else
                {
                    PaymentResponse res = JsonUtility.FromJson<PaymentResponse>(www.downloadHandler.text);
                    callback?.Invoke(res.success);
                }
            }
        }

        public IEnumerator RequestExit(string plateNumber, Action<bool, string> callback)
        {
            string url = $"{BASE_URL}/parking/exit";
            ExitRequest req = new ExitRequest { plate_number = plateNumber, exit_gate_id = "GATE-OUT-01" };
            string json = JsonUtility.ToJson(req);

            using (UnityWebRequest www = CreatePostRequest(url, json))
            {
                yield return www.SendWebRequest();

                if (www.result != UnityWebRequest.Result.Success)
                {
                    Debug.LogError($"Exit Error: {www.error}");
                    callback?.Invoke(false, www.error);
                }
                else
                {
                    ExitResponse res = JsonUtility.FromJson<ExitResponse>(www.downloadHandler.text);
                    callback?.Invoke(res.gate_open, res.message);
                }
            }
        }

        private UnityWebRequest CreatePostRequest(string url, string json)
        {
            UnityWebRequest www = new UnityWebRequest(url, "POST");
            byte[] bodyRaw = Encoding.UTF8.GetBytes(json);
            www.uploadHandler = new UploadHandlerRaw(bodyRaw);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");
            return www;
        }
    }
}
