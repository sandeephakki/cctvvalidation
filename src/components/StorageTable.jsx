import styles from './StorageTable.module.css'

export default function StorageTable({ storage }) {
  if (!storage?.length) return (
    <div className={styles.empty}>No storage detected</div>
  )
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr><th>#</th><th>Type</th><th>Size</th><th>Status</th></tr>
        </thead>
        <tbody>
          {storage.map((drive, i) => (
            <tr key={i}>
              <td>{drive.id || i + 1}</td>
              <td>{drive.type || 'HDD'}</td>
              <td>
                {drive.totalGB != null && drive.totalGB > 0
                  ? `${drive.totalGB} GB`
                  : <span className={styles.cantRead}>Could not read</span>}
                {drive.dataSource === 'manual' && <span className={styles.manual}>manual</span>}
              </td>
              <td><span className={styles.status}>{drive.status || '—'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
