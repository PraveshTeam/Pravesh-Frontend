import { useEffect } from 'react'

export default function Toast({ toasts, removeToast }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        minWidth: 300
      }}
    >
      {toasts.map(t => (
        <div
          key={t.id}
          className={`toast show align-items-center text-white border-0 mb-2
            ${t.type === 'success' ? 'bg-success' :
              t.type === 'error'   ? 'bg-danger'  :
              t.type === 'warning' ? 'bg-warning text-dark' : 'bg-primary'}`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body d-flex align-items-center gap-2">
              <i className={`bi ${
                t.type === 'success' ? 'bi-check-circle-fill' :
                t.type === 'error'   ? 'bi-x-circle-fill'     :
                t.type === 'warning' ? 'bi-exclamation-triangle-fill' :
                'bi-info-circle-fill'
              } fs-5`}></i>
              {t.message}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => removeToast(t.id)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}