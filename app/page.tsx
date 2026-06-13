import DiscoBackground from '@/components/DiscoBackground'
import ConfettiEffect from '@/components/ConfettiEffect'
import HeroSection from '@/components/HeroSection'
import CountdownTimer from '@/components/CountdownTimer'
import EventInfo from '@/components/EventInfo'
import WishlistSection from '@/components/WishlistSection'
import MemeSection from '@/components/MemeSection'

export default function Home() {
  return (
    <>
      <DiscoBackground />
      <ConfettiEffect />

      <main style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection />
        <CountdownTimer />
        <EventInfo />
        <WishlistSection />
        <MemeSection />

        <footer style={{ textAlign: 'center', padding: '40px 16px 60px', color: 'rgba(232,232,240,0.2)', fontSize: 13 }}>
          <p>Made with 💖 for Sashka&apos;s Birthday 2026</p>
        </footer>
      </main>
    </>
  )
}
