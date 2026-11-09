// 26 Supported Sensor DTCs from Excel Database
export const DTC_DATABASE = {
    "P0118":  {
                  "sensor":  "ECT",
                  "dtcCode":  "P0118",
                  "faultDescription":  "ECT circuit high input",
                  "possibleCauses":  [
                                         "Open signal circuit",
                                         "Disconnected sensor",
                                         "Damaged wiring",
                                         "Poor connection",
                                         "Failed sensor"
                                     ],
                  "recommendedActions":  [
                                             "Check live temperature",
                                             "Inspect connector",
                                             "Test circuit continuity",
                                             "Check sensor resistance",
                                             "Repair circuit or replace sensor if confirmed"
                                         ],
                  "severity":  "High"
              },
    "P0105":  {
                  "sensor":  "MAP",
                  "dtcCode":  "P0105",
                  "faultDescription":  "MAP circuit malfunction",
                  "possibleCauses":  [
                                         "Sensor failure",
                                         "Damaged wiring",
                                         "Poor connector",
                                         "Missing reference voltage",
                                         "Blocked pressure passage"
                                     ],
                  "recommendedActions":  [
                                             "Scan DTCs",
                                             "Inspect connector",
                                             "Check reference voltage and ground",
                                             "Inspect pressure passage or hose",
                                             "Test sensor output and repair confirmed fault"
                                         ],
                  "severity":  "Medium"
              },
    "P0107":  {
                  "sensor":  "MAP",
                  "dtcCode":  "P0107",
                  "faultDescription":  "MAP circuit low input",
                  "possibleCauses":  [
                                         "Signal short to ground",
                                         "Sensor failure",
                                         "Open reference circuit",
                                         "Damaged wiring",
                                         "Poor connector"
                                     ],
                  "recommendedActions":  [
                                             "Check live pressure data",
                                             "Inspect connector",
                                             "Test signal voltage",
                                             "Check reference voltage and ground",
                                             "Repair wiring or replace sensor if confirmed"
                                         ],
                  "severity":  "Medium"
              },
    "P0124":  {
                  "sensor":  "TPS",
                  "dtcCode":  "P0124",
                  "faultDescription":  "TPS intermittent signal",
                  "possibleCauses":  [
                                         "Loose connector",
                                         "Damaged wire",
                                         "Worn sensor track",
                                         "Vibration",
                                         "Intermittent electrical contact"
                                     ],
                  "recommendedActions":  [
                                             "Inspect connector",
                                             "Check wiring for intermittent faults",
                                             "Monitor live data",
                                             "Perform suitable continuity test",
                                             "Repair connection or replace sensor if confirmed"
                                         ],
                  "severity":  "Medium"
              },
    "P0122":  {
                  "sensor":  "TPS",
                  "dtcCode":  "P0122",
                  "faultDescription":  "TPS circuit low input",
                  "possibleCauses":  [
                                         "Signal short to ground",
                                         "Open circuit",
                                         "Poor connection",
                                         "Failed sensor",
                                         "Reference-voltage issue"
                                     ],
                  "recommendedActions":  [
                                             "Check DTCs",
                                             "Inspect connector",
                                             "Test signal wire",
                                             "Check 5 V reference and ground",
                                             "Repair wiring or replace sensor if confirmed"
                                         ],
                  "severity":  "Medium"
              },
    "P0109":  {
                  "sensor":  "MAP",
                  "dtcCode":  "P0109",
                  "faultDescription":  "MAP intermittent signal",
                  "possibleCauses":  [
                                         "Loose connector",
                                         "Damaged wiring",
                                         "Intermittent sensor fault",
                                         "Vibration",
                                         "Poor electrical contact"
                                     ],
                  "recommendedActions":  [
                                             "Monitor MAP readings",
                                             "Inspect connector",
                                             "Check wiring harness",
                                             "Test for intermittent signal loss",
                                             "Repair connection or replace sensor if confirmed"
                                         ],
                  "severity":  "Medium"
              },
    "P0130":  {
                  "sensor":  "O2",
                  "dtcCode":  "P0130",
                  "faultDescription":  "O2 sensor circuit malfunction (Bank 1 Sensor 1)",
                  "possibleCauses":  [
                                         "Failed sensor",
                                         "Wiring damage",
                                         "Connector fault",
                                         "Ground problem",
                                         "Exhaust leak"
                                     ],
                  "recommendedActions":  [
                                             "Scan DTCs",
                                             "Inspect connector",
                                             "Check wiring",
                                             "Monitor O2 live data",
                                             "Test circuit and replace sensor if confirmed faulty"
                                         ],
                  "severity":  "High"
              },
    "P0119":  {
                  "sensor":  "ECT",
                  "dtcCode":  "P0119",
                  "faultDescription":  "ECT intermittent signal",
                  "possibleCauses":  [
                                         "Loose connection",
                                         "Broken wire",
                                         "Sensor failure",
                                         "Corrosion",
                                         "Vibration-related fault"
                                     ],
                  "recommendedActions":  [
                                             "Inspect connector",
                                             "Check wiring harness",
                                             "Monitor live temperature",
                                             "Test for intermittent continuity",
                                             "Repair wiring or replace sensor if confirmed"
                                         ],
                  "severity":  "High"
              },
    "P0132":  {
                  "sensor":  "O2",
                  "dtcCode":  "P0132",
                  "faultDescription":  "O2 sensor circuit high voltage (Bank 1 Sensor 1)",
                  "possibleCauses":  [
                                         "Signal short to voltage",
                                         "Rich mixture",
                                         "Sensor failure",
                                         "Wiring fault",
                                         "Fuel-system problem"
                                     ],
                  "recommendedActions":  [
                                             "Read live O2 data",
                                             "Inspect wiring",
                                             "Check fuel trims",
                                             "Investigate rich-running conditions",
                                             "Test sensor and circuit before replacement"
                                         ],
                  "severity":  "High"
              },
    "P0115":  {
                  "sensor":  "ECT",
                  "dtcCode":  "P0115",
                  "faultDescription":  "ECT circuit malfunction",
                  "possibleCauses":  [
                                         "Sensor failure",
                                         "Wiring fault",
                                         "Connector corrosion",
                                         "Poor ground",
                                         "Reference-circuit problem"
                                     ],
                  "recommendedActions":  [
                                             "Scan DTCs",
                                             "Inspect connector",
                                             "Check wiring",
                                             "Measure sensor resistance against temperature specifications",
                                             "Repair circuit or replace sensor if confirmed"
                                         ],
                  "severity":  "High"
              },
    "P0123":  {
                  "sensor":  "TPS",
                  "dtcCode":  "P0123",
                  "faultDescription":  "TPS circuit high input",
                  "possibleCauses":  [
                                         "Signal short to voltage",
                                         "Faulty sensor",
                                         "Poor ground",
                                         "Wiring damage",
                                         "Connector fault"
                                     ],
                  "recommendedActions":  [
                                             "Read live data",
                                             "Inspect wiring",
                                             "Check signal voltage",
                                             "Test ground and reference voltage",
                                             "Repair circuit or replace sensor if needed"
                                         ],
                  "severity":  "Medium"
              },
    "P0121":  {
                  "sensor":  "TPS",
                  "dtcCode":  "P0121",
                  "faultDescription":  "TPS range/performance problem",
                  "possibleCauses":  [
                                         "Incorrect signal",
                                         "Worn sensor track",
                                         "Throttle problem",
                                         "Wiring fault",
                                         "Incorrect installation"
                                     ],
                  "recommendedActions":  [
                                             "Check live TPS data",
                                             "Compare with throttle position",
                                             "Inspect throttle body",
                                             "Check wiring",
                                             "Test or replace sensor if confirmed faulty"
                                         ],
                  "severity":  "Medium"
              },
    "P0134":  {
                  "sensor":  "O2",
                  "dtcCode":  "P0134",
                  "faultDescription":  "O2 sensor no activity detected (Bank 1 Sensor 1)",
                  "possibleCauses":  [
                                         "Open circuit",
                                         "Failed sensor",
                                         "Disconnected connector",
                                         "Heater issue",
                                         "Wiring fault"
                                     ],
                  "recommendedActions":  [
                                             "Check live O2 data",
                                             "Inspect connector",
                                             "Test signal wiring",
                                             "Check heater circuit where applicable",
                                             "Repair circuit or replace sensor if confirmed"
                                         ],
                  "severity":  "High"
              },
    "P0100":  {
                  "sensor":  "MAF",
                  "dtcCode":  "P0100",
                  "faultDescription":  "MAF circuit malfunction",
                  "possibleCauses":  [
                                         "Failed sensor",
                                         "Wiring damage",
                                         "Connector fault",
                                         "Power-supply issue",
                                         "Ground fault"
                                     ],
                  "recommendedActions":  [
                                             "Scan DTCs",
                                             "Inspect connector",
                                             "Check power and ground",
                                             "Test signal output",
                                             "Repair circuit or replace sensor if confirmed"
                                         ],
                  "severity":  "High"
              },
    "P0120":  {
                  "sensor":  "TPS",
                  "dtcCode":  "P0120",
                  "faultDescription":  "TPS circuit malfunction",
                  "possibleCauses":  [
                                         "Sensor failure",
                                         "Damaged wiring",
                                         "Loose connector",
                                         "Poor ground",
                                         "Reference-voltage fault"
                                     ],
                  "recommendedActions":  [
                                             "Scan DTCs",
                                             "Inspect connector",
                                             "Check wiring continuity",
                                             "Measure reference voltage and ground",
                                             "Test TPS output"
                                         ],
                  "severity":  "Medium"
              },
    "P0116":  {
                  "sensor":  "ECT",
                  "dtcCode":  "P0116",
                  "faultDescription":  "ECT range/performance problem",
                  "possibleCauses":  [
                                         "Incorrect temperature reading",
                                         "Thermostat problem",
                                         "Cooling-system issue",
                                         "Sensor fault",
                                         "Wiring fault"
                                     ],
                  "recommendedActions":  [
                                             "Check cold-engine live data",
                                             "Compare with ambient temperature",
                                             "Inspect coolant level safely",
                                             "Test thermostat operation",
                                             "Check sensor and wiring"
                                         ],
                  "severity":  "High"
              },
    "P0108":  {
                  "sensor":  "MAP",
                  "dtcCode":  "P0108",
                  "faultDescription":  "MAP circuit high input",
                  "possibleCauses":  [
                                         "Signal short to voltage",
                                         "Sensor failure",
                                         "Ground fault",
                                         "Damaged wiring",
                                         "Connector issue"
                                     ],
                  "recommendedActions":  [
                                             "Read live data",
                                             "Inspect wiring",
                                             "Measure signal voltage",
                                             "Test ground and reference supply",
                                             "Repair circuit or replace sensor if confirmed"
                                         ],
                  "severity":  "Medium"
              },
    "P0101":  {
                  "sensor":  "MAF",
                  "dtcCode":  "P0101",
                  "faultDescription":  "MAF range/performance problem",
                  "possibleCauses":  [
                                         "Dirty sensor",
                                         "Intake leak",
                                         "Blocked air filter",
                                         "Incorrect airflow reading",
                                         "Wiring fault"
                                     ],
                  "recommendedActions":  [
                                             "Read live MAF data",
                                             "Inspect air filter",
                                             "Check intake hoses for leaks",
                                             "Clean using approved MAF cleaner if appropriate",
                                             "Recheck readings and replace sensor only if confirmed faulty"
                                         ],
                  "severity":  "High"
              },
    "P0103":  {
                  "sensor":  "MAF",
                  "dtcCode":  "P0103",
                  "faultDescription":  "MAF circuit high input",
                  "possibleCauses":  [
                                         "Signal short to voltage",
                                         "Wiring fault",
                                         "Failed sensor",
                                         "Connector problem",
                                         "Electrical interference"
                                     ],
                  "recommendedActions":  [
                                             "Check live MAF readings",
                                             "Inspect wiring",
                                             "Measure signal output",
                                             "Test power and ground circuits",
                                             "Repair circuit or replace sensor if confirmed"
                                         ],
                  "severity":  "High"
              },
    "P0135":  {
                  "sensor":  "O2",
                  "dtcCode":  "P0135",
                  "faultDescription":  "O2 sensor heater circuit malfunction (Bank 1 Sensor 1)",
                  "possibleCauses":  [
                                         "Failed heater element",
                                         "Blown fuse",
                                         "Damaged wiring",
                                         "Poor connector",
                                         "Power-supply fault"
                                     ],
                  "recommendedActions":  [
                                             "Scan DTCs",
                                             "Inspect connector",
                                             "Check relevant fuse",
                                             "Test heater power, ground and resistance to specifications",
                                             "Repair wiring or replace heater/sensor assembly if confirmed"
                                         ],
                  "severity":  "Medium"
              },
    "P0133":  {
                  "sensor":  "O2",
                  "dtcCode":  "P0133",
                  "faultDescription":  "O2 sensor slow response (Bank 1 Sensor 1)",
                  "possibleCauses":  [
                                         "Aging sensor",
                                         "Contamination",
                                         "Exhaust leak",
                                         "Wiring problem",
                                         "Mixture-control issue"
                                     ],
                  "recommendedActions":  [
                                             "Monitor response using suitable scan tool",
                                             "Inspect sensor wiring",
                                             "Check for exhaust leaks",
                                             "Investigate fuel-mixture faults",
                                             "Replace sensor if response testing confirms failure"
                                         ],
                  "severity":  "Medium"
              },
    "P0117":  {
                  "sensor":  "ECT",
                  "dtcCode":  "P0117",
                  "faultDescription":  "ECT circuit low input",
                  "possibleCauses":  [
                                         "Signal short to ground",
                                         "Failed sensor",
                                         "Damaged wiring",
                                         "Poor connector",
                                         "Circuit fault"
                                     ],
                  "recommendedActions":  [
                                             "Read live temperature",
                                             "Inspect connector",
                                             "Check signal wire",
                                             "Test sensor resistance",
                                             "Repair wiring or replace sensor if confirmed"
                                         ],
                  "severity":  "High"
              },
    "P0102":  {
                  "sensor":  "MAF",
                  "dtcCode":  "P0102",
                  "faultDescription":  "MAF circuit low input",
                  "possibleCauses":  [
                                         "Low signal",
                                         "Damaged wire",
                                         "Short to ground",
                                         "Sensor contamination",
                                         "Failed sensor"
                                     ],
                  "recommendedActions":  [
                                             "Monitor live data",
                                             "Inspect connector",
                                             "Check wiring",
                                             "Test power and ground",
                                             "Clean or replace sensor if testing confirms the cause"
                                         ],
                  "severity":  "High"
              },
    "P0104":  {
                  "sensor":  "MAF",
                  "dtcCode":  "P0104",
                  "faultDescription":  "MAF intermittent signal",
                  "possibleCauses":  [
                                         "Loose connector",
                                         "Damaged wiring",
                                         "Sensor failure",
                                         "Vibration",
                                         "Poor electrical contact"
                                     ],
                  "recommendedActions":  [
                                             "Monitor live data",
                                             "Inspect connector pins",
                                             "Check harness condition",
                                             "Test for intermittent electrical faults",
                                             "Repair wiring or replace sensor if confirmed"
                                         ],
                  "severity":  "High"
              },
    "P0106":  {
                  "sensor":  "MAP",
                  "dtcCode":  "P0106",
                  "faultDescription":  "MAP range/performance problem",
                  "possibleCauses":  [
                                         "Implausible pressure reading",
                                         "Intake leak",
                                         "Blocked passage",
                                         "Sensor fault",
                                         "Wiring issue"
                                     ],
                  "recommendedActions":  [
                                             "Read live MAP data",
                                             "Compare key-on and engine-running readings",
                                             "Inspect intake system",
                                             "Check wiring",
                                             "Test or replace sensor if confirmed faulty"
                                         ],
                  "severity":  "Medium"
              },
    "P0131":  {
                  "sensor":  "O2",
                  "dtcCode":  "P0131",
                  "faultDescription":  "O2 sensor circuit low voltage (Bank 1 Sensor 1)",
                  "possibleCauses":  [
                                         "Signal short to ground",
                                         "Sensor fault",
                                         "Wiring damage",
                                         "Exhaust leak",
                                         "Mixture problem"
                                     ],
                  "recommendedActions":  [
                                             "Monitor O2 signal",
                                             "Inspect wiring",
                                             "Check for exhaust leaks",
                                             "Check fuel-trim data",
                                             "Test circuit and sensor before replacement"
                                         ],
                  "severity":  "High"
              }
};

