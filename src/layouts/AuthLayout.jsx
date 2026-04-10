import { Outlet } from 'react-router-dom'
import BackgroundStars from '../components/BackgroundStars'

export default function AuthLayout() {
  return (
    <div className="auth-wrapper">
      <BackgroundStars />
      <div className="auth-card shadow-lg">
        <div className="auth-logo">SysMedia</div>
        <Outlet />
      </div>
    </div>
  )
}
