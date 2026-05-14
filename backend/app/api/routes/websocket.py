"""
WebSocket endpoint for real-time vitals streaming.
Simulates IoT device data push every 2.5 seconds.
"""
import asyncio
import json
import math
import random
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict

router = APIRouter(prefix="/ws", tags=["WebSocket"])

# Track active connections per patient
_connections: Dict[int, list] = {}


def _generate_vitals(tick: int, patient_id: int) -> dict:
    """Simulate realistic IoT vital readings with slight variation."""
    seed = patient_id * 100 + tick
    rng  = random.Random(seed)

    heart_rate  = 70  + round(math.sin(tick * 0.3) * 12 + rng.uniform(-3, 3))
    systolic    = 120 + round(math.sin(tick * 0.2) * 18 + rng.uniform(-5, 5))
    diastolic   = 80  + round(math.sin(tick * 0.25) * 8 + rng.uniform(-3, 3))
    temperature = round(98.2 + math.sin(tick * 0.1) * 1.0 + rng.uniform(-0.2, 0.2), 1)
    spo2        = min(100, 97 + round(math.sin(tick * 0.15) * 1.5))
    resp_rate   = 16  + round(math.sin(tick * 0.2) * 2 + rng.uniform(-1, 1))

    # Determine if any vital is abnormal
    abnormal = (
        heart_rate  < 60  or heart_rate  > 100 or
        systolic    < 90  or systolic    > 140 or
        diastolic   < 60  or diastolic   > 90  or
        temperature < 97  or temperature > 99  or
        spo2        < 95  or
        resp_rate   < 12  or resp_rate   > 20
    )

    return {
        "patient_id": patient_id,
        "tick":       tick,
        "heart_rate": heart_rate,
        "systolic_bp": systolic,
        "diastolic_bp": diastolic,
        "temperature": temperature,
        "spo2":        spo2,
        "resp_rate":   resp_rate,
        "is_abnormal": abnormal,
        "alert":       abnormal and (tick % 5 == 0),  # alert every 5th abnormal reading
    }


@router.websocket("/vitals/{patient_id}")
async def vitals_stream(websocket: WebSocket, patient_id: int):
    """
    Stream simulated real-time vitals for a patient.
    Connect: ws://localhost:8000/api/v1/ws/vitals/{patient_id}
    """
    await websocket.accept()

    if patient_id not in _connections:
        _connections[patient_id] = []
    _connections[patient_id].append(websocket)

    tick = 0
    try:
        while True:
            vitals = _generate_vitals(tick, patient_id)
            await websocket.send_text(json.dumps(vitals))
            tick += 1
            await asyncio.sleep(2.5)
    except WebSocketDisconnect:
        if patient_id in _connections:
            _connections[patient_id] = [
                ws for ws in _connections[patient_id] if ws != websocket
            ]


@router.websocket("/notifications/{user_id}")
async def notifications_stream(websocket: WebSocket, user_id: int):
    """
    Stream real-time notifications for a user.
    Connect: ws://localhost:8000/api/v1/ws/notifications/{user_id}
    """
    await websocket.accept()
    tick = 0
    try:
        while True:
            await asyncio.sleep(30)
            # Send a heartbeat ping
            await websocket.send_text(json.dumps({"type": "ping", "tick": tick}))
            tick += 1
    except WebSocketDisconnect:
        pass
