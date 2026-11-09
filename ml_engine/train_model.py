"""
train_model.py
Trains a Scikit-Learn Random Forest Classifier for Engine Fault Detection
using real-time sensor parameters: TPS, ECT, MAF, MAP, O2 (+ RPM, Speed).
Matches Presentation Slide 7 & References [2], [3], [4].
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.preprocessing import StandardScaler

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
dataset_file = os.path.join(SCRIPT_DIR, 'sensor_fault_dataset.csv')

# 1. Check or generate dataset
if not os.path.exists(dataset_file):
    print("[ML] Generating synthetic sensor telemetry dataset...")
    import sys
    if SCRIPT_DIR not in sys.path:
        sys.path.insert(0, SCRIPT_DIR)
    import generate_dataset

df = pd.read_csv(dataset_file)
print(f"[ML] Loaded dataset with {len(df)} samples.")

# 2. Features and Labels
feature_cols = ['rpm', 'speed', 'tps', 'ect', 'maf', 'map', 'o2']
X = df[feature_cols]
y = df['fault_type']

# 3. Train / Test Split (80% Train, 20% Test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

# 4. Feature Scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 5. Train Random Forest Classifier (100 Trees)
print("[ML] Training Random Forest Classifier (n_estimators=100, max_depth=12)...")
rf_classifier = RandomForestClassifier(
    n_estimators=100,
    max_depth=12,
    criterion='gini',
    random_state=42,
    n_jobs=-1
)
rf_classifier.fit(X_train_scaled, y_train)

# 6. Evaluation
y_pred = rf_classifier.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)
print("=" * 60)
print(f"  RANDOM FOREST ACCURACY: {accuracy * 100:.2f}%")
print("=" * 60)
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# 7. Feature Importances
importances = pd.Series(rf_classifier.feature_importances_, index=feature_cols).sort_values(ascending=False)
print("\nSensor Feature Importances:")
for feat, imp in importances.items():
    print(f"  - {feat.upper():<6}: {imp * 100:.2f}%")

# 8. Save Model and Scaler
model_path = os.path.join(SCRIPT_DIR, 'random_forest_model.pkl')
scaler_path = os.path.join(SCRIPT_DIR, 'sensor_scaler.pkl')
joblib.dump(rf_classifier, model_path)
joblib.dump(scaler, scaler_path)
print(f"\n✓ Model saved as '{model_path}'")
print(f"✓ Scaler saved as '{scaler_path}'")

