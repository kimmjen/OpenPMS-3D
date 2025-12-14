using UnityEngine;
using OpenPMS.Controllers;
using OpenPMS.Models;

namespace OpenPMS.Core
{
    public class SimulationManager : MonoBehaviour
    {
        public CarController carController;
        public GateController entryGate;
        public GateController exitGate;

        public void OnClickSimulateEntry()
        {
            Debug.Log("Simulating Entry...");
            // 1. Car moves to Entry Gate
            carController.StartEntrySequence(() => {
                // 2. Call API
                StartCoroutine(NetworkManager.Instance.RequestEntry(carController.plateNumber, (success, msg) => {
                    Debug.Log($"Entry Result: {success} - {msg}");
                    if (success)
                    {
                        // 3. Open Gate
                        entryGate.OpenGate();
                        
                        // 4. Car Parks
                        carController.MoveToParkingSpot(() => {
                            entryGate.CloseGate();
                            Debug.Log("Car Parked.");
                        });
                    }
                    else
                    {
                        Debug.LogWarning("Entry Denied.");
                    }
                }));
            });
        }

        public void OnClickSimulateExit()
        {
            Debug.Log("Simulating Exit...");
            // 1. Car moves to Exit Gate
            carController.StartExitSequence(() => {
                // 2. Check Status
                StartCoroutine(NetworkManager.Instance.CheckStatus(carController.plateNumber, (status) => {
                    if (status == null) return;

                    Debug.Log($"Fee: {status.total_fee}, Paid: {status.is_paid}");

                    if (!status.is_paid && status.total_fee > 0)
                    {
                        // Simulate Payment
                        StartCoroutine(NetworkManager.Instance.PayFee(carController.plateNumber, status.total_fee, (paySuccess) => {
                            if (paySuccess) RequestExitCall();
                        }));
                    }
                    else
                    {
                        RequestExitCall();
                    }
                }));
            });
        }

        private void RequestExitCall()
        {
            StartCoroutine(NetworkManager.Instance.RequestExit(carController.plateNumber, (success, msg) => {
                 Debug.Log($"Exit Result: {success} - {msg}");
                 if (success)
                 {
                     exitGate.OpenGate();
                     carController.ExitParking(() => {
                         exitGate.CloseGate();
                         Debug.Log("Car Exited.");
                     });
                 }
            }));
        }
    }
}
