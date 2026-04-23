import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [permission, setPermission] = useState(Notification.permission)
  const [product, setProduct] = useState(null)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  // Capture install event
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // Ask notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications.')
      return
    }

    const status = await Notification.requestPermission()
    setPermission(status)
  }

  // Install PWA
  const installApp = async () => {
    if (!installPrompt) return

    installPrompt.prompt()

    const result = await installPrompt.userChoice

    if (result.outcome === 'accepted') {
      console.log('User accepted install')
      setIsInstalled(true)
    } else {
      console.log('User dismissed install')
    }

    setInstallPrompt(null)
  }

  // Fetch sample API product
  const fetchSampleProduct = async () => {
    const res = await fetch('https://fakestoreapi.com/products/1')
    const data = await res.json()
    setProduct(data)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <h1>🔥 PWA Deal Alerts</h1>

      {/* Install Button */}
      {!isInstalled && installPrompt && (
        <button
          onClick={installApp}
          style={{
            padding: '10px',
            background: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginBottom: '20px',
            cursor: 'pointer'
          }}
        >
          Install App
        </button>
      )}

      {/* Notification Permission */}
      <div style={{
        padding: '15px',
        background: '#f4f4f4',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <p>
          <strong>Push Permission Status:</strong> {permission}
        </p>

        {permission !== 'granted' && (
          <button
            onClick={requestNotificationPermission}
            style={{
              padding: '10px',
              background: 'blue',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Enable Background Alerts
          </button>
        )}
      </div>

      {/* API Test Button */}
      <button
        onClick={fetchSampleProduct}
        style={{ padding: '10px', cursor: 'pointer' }}
      >
        Fetch App Data (Standard API Call)
      </button>

      {/* Product Display */}
      {product && (
        <div style={{
          marginTop: '20px',
          border: '1px solid #ccc',
          padding: '15px'
        }}>
          <h3>{product.title}</h3>
          <p>${product.price}</p>
        </div>
      )}
    </div>
  )
}

export default App