// lib/session.ts - Simple session utility
export function getCurrentUser() {
  // For now, return a mock user - you can integrate with your actual auth system later
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('currentUser')
    return userData ? JSON.parse(userData) : null
  }
  return null
}

export function setCurrentUser(user: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', JSON.stringify(user))
  }
}