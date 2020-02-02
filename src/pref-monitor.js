import { startFPSMonitor, startMemMonitor } from 'https://cdn.jsdelivr.net/npm/perf-monitor@0.4.1/dist/es6/perf-monitor.js'

$('#perf').addEventListener('click', () => {
  startFPSMonitor();
  startMemMonitor();
  $('#perf').style.display = 'none';
});
