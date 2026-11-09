"""
generate_dataset.py
Generates a realistic automotive sensor telemetry dataset for the 5 target sensors:
- TPS (Throttle Position Sensor, %)
- ECT (Engine Coolant Temperature, °C)
- MAF (Mass Air Flow, g/s)
- MAP (Manifold Absolute Pressure, kPa)
- O2 (Oxygen Sensor Bank 1 Sensor 1, V)
plus Engine RPM and Vehicle Speed.
"""

import os
import numpy as np
import pandas as pd

np.random.seed(42)
num_samples = 5000

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
dataset_file = os.path.join(SCRIPT_DIR, 'sensor_fault_dataset.csv')

data = []

for _ in range(num_samples):
    # Operating regime: 0 = Idle, 1 = Cruising, 2 = Acceleration
    regime = np.random.choice([0, 1, 2], p=[0.3, 0.5, 0.2])
    
    if regime == 0:  # Idle
        rpm = np.random.normal(750, 40)
        speed = 0
        tps = np.random.normal(12.0, 1.0)
        maf = np.random.normal(2.5, 0.3)
        map_val = np.random.normal(32, 2.5)
    elif regime == 1:  # Cruising (40 - 80 km/h)
        speed = np.random.normal(60, 10)
        rpm = np.random.normal(1800, 150)
        tps = np.random.normal(22.0, 3.0)
        maf = np.random.normal(12.0, 2.0)
        map_val = np.random.normal(48, 5.0)
    else:  # Hard Acceleration
        speed = np.random.normal(85, 15)
        rpm = np.random.normal(3200, 400)
        tps = np.random.normal(55.0, 8.0)
        maf = np.random.normal(32.0, 5.0)
        map_val = np.random.normal(78, 6.0)

    # Base operating ECT (warmed up: 80 - 95 C)
    ect = np.random.normal(88, 4)
    # Base switching O2 sensor (0.1 to 0.9 V)
    o2 = np.random.uniform(0.15, 0.85)

    # Inject Fault Conditions (15% chance of fault)
    fault_type = np.random.choice(
        ['NORMAL', 'MAF_FAULT', 'ECT_OVERHEAT', 'TPS_MALFUNCTION', 'MAP_VACUUM_LEAK', 'O2_DEGRADED'],
        p=[0.85, 0.03, 0.03, 0.03, 0.03, 0.03]
    )

    if fault_type == 'MAF_FAULT':
        # MAF reads abnormally low or high compared to RPM
        maf = maf * np.random.choice([0.3, 2.2])
    elif fault_type == 'ECT_OVERHEAT':
        # Engine overheating above threshold
        ect = np.random.normal(112, 4)
    elif fault_type == 'TPS_MALFUNCTION':
        # Throttle sensor spikes or drops out
        tps = np.random.choice([2.0, 96.0])
    elif fault_type == 'MAP_VACUUM_LEAK':
        # Manifold pressure abnormally high at low throttle
        map_val = map_val + np.random.uniform(25, 40)
    elif fault_type == 'O2_DEGRADED':
        # O2 sensor stuck lean (<0.08V) or stuck rich (>1.05V)
        o2 = np.random.choice([0.04, 1.12])

    data.append({
        'rpm': round(max(0, rpm), 0),
        'speed': round(max(0, speed), 0),
        'tps': round(max(0, min(100, tps)), 2),
        'ect': round(max(-20, min(130, ect)), 1),
        'maf': round(max(0, maf), 2),
        'map': round(max(10, min(120, map_val)), 1),
        'o2': round(max(0, min(1.2, o2)), 2),
        'condition': 'NORMAL' if fault_type == 'NORMAL' else 'FAULT',
        'fault_type': fault_type
    })

df = pd.DataFrame(data)
df.to_csv(dataset_file, index=False)
print(f"Dataset generated successfully with {len(df)} samples.")
print(df['fault_type'].value_counts())

