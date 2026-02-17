function ActivityLog({ logs }) {
  return (
    <div>
      <h3>Activity Log</h3>
      {logs.map((log) => (
        <p key={log.id}>
          {log.text} - {log.time}
        </p>
      ))}
    </div>
  );
}

export default ActivityLog;
