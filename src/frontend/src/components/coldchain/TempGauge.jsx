export default function TempGauge({ temperature, threshold }) {
  let cls = 'ok';
  if (threshold) {
    if (temperature < threshold.min || temperature > threshold.max) cls = 'crit';
    else if (
      temperature > threshold.max - 1 ||
      temperature < threshold.min + 1
    ) cls = 'warn';
  }

  return (
    <span className={`temp-gauge ${cls}`}>
      {cls === 'crit' ? '🌡️' : cls === 'warn' ? '⚠️' : '✅'}
      {temperature}°C
    </span>
  );
}
