using System;
using System.Collections;
using UnityEngine;

namespace OpenPMS.Controllers
{
    public class CarController : MonoBehaviour
    {
        public enum CarState { Idle, MovingToEntry, WaitingEntry, Parking, Parked, MovingToExit, WaitingExit, Exiting }
        
        public float speed = 5.0f;
        public string plateNumber = "12가3456";

        // Targets (Assign via Manager or Find)
        public Transform entryGatePos;
        public Transform parkingSpotPos;
        public Transform exitGatePos;
        public Transform exitFinalPos;

        private CarState currentState = CarState.Idle;

        private void Update()
        {
            // Just for debugging/logging current state to remove CS0414 warning
            if (currentState != CarState.Idle)
            {
                // Logic can be implemented here based on state
            }
        }

        public void StartEntrySequence(Action onArriveEntry)
        {
            currentState = CarState.MovingToEntry;
            StartCoroutine(MoveTo(entryGatePos.position, () => {
                currentState = CarState.WaitingEntry;
                onArriveEntry?.Invoke();
            }));
        }

        public void MoveToParkingSpot(Action onParked)
        {
            currentState = CarState.Parking;
            StartCoroutine(MoveTo(parkingSpotPos.position, () => {
                currentState = CarState.Parked;
                onParked?.Invoke();
            }));
        }

        public void StartExitSequence(Action onArriveExit)
        {
            currentState = CarState.MovingToExit;
            StartCoroutine(MoveTo(exitGatePos.position, () => {
                currentState = CarState.WaitingExit;
                onArriveExit?.Invoke();
            }));
        }

        public void ExitParking(Action onExited)
        {
            currentState = CarState.Exiting;
            StartCoroutine(MoveTo(exitFinalPos.position, () => {
                currentState = CarState.Idle;
                onExited?.Invoke();
            }));
        }

        private IEnumerator MoveTo(Vector3 target, Action onComplete)
        {
            while (Vector3.Distance(transform.position, target) > 0.1f)
            {
                transform.position = Vector3.MoveTowards(transform.position, target, speed * Time.deltaTime);
                transform.LookAt(target);
                yield return null;
            }
            onComplete?.Invoke();
        }
    }
}
