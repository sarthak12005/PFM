import React from 'react'
import { useAuth } from '../../context/AuthContext'

const UserDebug = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">Loading user data...</div>
  }

  return (
    <div className="p-4 bg-blue-100 border border-blue-300 rounded mb-4">
      <h3 className="font-bold text-blue-800 mb-2">User Debug Info:</h3>
      <pre className="text-sm text-blue-700 whitespace-pre-wrap">
        {JSON.stringify(user, null, 2)}
      </pre>
      <div className="mt-2 text-sm">
        <p><strong>Is Admin:</strong> {user?.role === 'admin' ? 'YES' : 'NO'}</p>
        <p><strong>Role:</strong> {user?.role || 'undefined'}</p>
        <p><strong>Email:</strong> {user?.email || 'undefined'}</p>
      </div>
    </div>
  )
}

export default UserDebug
