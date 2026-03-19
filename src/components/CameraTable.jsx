import { useState } from 'react'
import { resolutionToMP } from '../services/scanService'
import styles from './CameraTable.module.css'

export default function CameraTable({ cameras, onUpdate }) {
  const [editing, setEditing] = useState(null)
  const [editVal, setEditVal] = useState('')

  if (!cameras?.length) return (
    <div className={styles.empty}>No camera channels detected</div>
  )

  function handleCellClick(idx, field, currentVal) {
    setEditing(`${idx}-${field}`)
    setEditVal(currentVal || '')
  }

  function handleSave(idx, field) {
    if (onUpdate) onUpdate(idx, field, editVal, 'manual')
    setEditing(null)
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>CH</th>
            <th>Name</th>
            <th>Resolution</th>
            <th>MP</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {cameras.map((cam, idx) => {
            const mp = cam.mp ?? resolutionToMP(cam.resolution)
            const editKey = `${idx}-resolution`
            return (
              <tr key={idx}>
                <td className={styles.ch}>{cam.channelId}</td>
                <td>{cam.name || '—'}</td>
                <td>
                  {editing === editKey ? (
                    <div className={styles.inlineEdit}>
                      <input
                        autoFocus
                        value={editVal}
                        onChange={e => setEditVal(e.target.value)}
                        placeholder="e.g. 1920x1080"
                        className={styles.inlineInput}
                        aria-label="Enter resolution"
                      />
                      <button className={styles.saveBtn} onClick={() => handleSave(idx, 'resolution')}>Save</button>
                    </div>
                  ) : (
                    <button
                      className={`${styles.cellBtn} ${!cam.resolution ? styles.empty : ''}`}
                      onClick={() => handleCellClick(idx, 'resolution', cam.resolution)}
                      aria-label={cam.resolution ? `Edit resolution ${cam.resolution}` : 'Enter resolution'}
                    >
                      {cam.resolution || <span className={styles.cantRead}>Could not read</span>}
                      {cam.dataSource === 'manual' && <span className={styles.manual}>manual</span>}
                    </button>
                  )}
                </td>
                <td>{mp != null ? `${mp} MP` : <span className={styles.cantRead}>—</span>}</td>
                <td>
                  <span className={`${styles.status} ${styles[cam.status] || ''}`}>
                    {cam.status || '—'}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
