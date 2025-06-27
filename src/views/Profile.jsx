import PresidentesList from '../components/PresidentesList'
import WelcomeSection from '../components/welcomeSection'
const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <WelcomeSection></WelcomeSection>
      {/* Presidents List Component */}
      <PresidentesList />
    </div>
  )
}

export default Profile
