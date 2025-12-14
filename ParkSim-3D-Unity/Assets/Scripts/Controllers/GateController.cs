using System.Collections;
using UnityEngine;

namespace OpenPMS.Controllers
{
    public class GateController : MonoBehaviour
    {
        public Transform barrierBar; // Assign in Inspector
        public float openAngle = 90f;
        public float closedAngle = 0f;
        public float speed = 2.0f;

        private bool isOpen = false;

        public void OpenGate()
        {
            if (isOpen) return;
            StopAllCoroutines();
            StartCoroutine(RotateGate(openAngle));
            isOpen = true;
        }

        public void CloseGate()
        {
            if (!isOpen) return;
            StopAllCoroutines();
            StartCoroutine(RotateGate(closedAngle));
            isOpen = false;
        }

        private IEnumerator RotateGate(float targetZ)
        {
            Quaternion targetRotation = Quaternion.Euler(0, 0, targetZ);
            while (Quaternion.Angle(barrierBar.localRotation, targetRotation) > 0.1f)
            {
                barrierBar.localRotation = Quaternion.Slerp(barrierBar.localRotation, targetRotation, Time.deltaTime * speed);
                yield return null;
            }
            barrierBar.localRotation = targetRotation;
        }
    }
}
