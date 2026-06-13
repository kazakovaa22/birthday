'use client'

const BALLS = [
  { left: '4%',  top: '2%',  size: 160, floatDelay: '0s',   spinDuration: '8s',  sparkleOffset: 0   },
  { left: '68%', top: '0%',  size: 120, floatDelay: '2.5s', spinDuration: '11s', sparkleOffset: 3   },
  { left: '84%', top: '18%', size: 95,  floatDelay: '1.2s', spinDuration: '9s',  sparkleOffset: 1.5 },
]

const SPARKLE_POSITIONS = [
  { x: -0.7, y: -0.6, delay: '0s',    dur: '1.4s', color: '#fff9c4' },
  { x:  0.8, y: -0.4, delay: '0.5s',  dur: '1.8s', color: '#ffd700' },
  { x: -0.5, y:  0.8, delay: '1.1s',  dur: '1.2s', color: '#ffffff' },
  { x:  0.9, y:  0.7, delay: '0.3s',  dur: '2.0s', color: '#ffe066' },
  { x:  0.0, y: -1.0, delay: '0.8s',  dur: '1.6s', color: '#ffffff' },
  { x: -1.0, y:  0.1, delay: '1.4s',  dur: '1.3s', color: '#ffd700' },
  { x:  0.6, y: -0.9, delay: '0.2s',  dur: '1.7s', color: '#fff9c4' },
  { x: -0.8, y:  0.5, delay: '1.0s',  dur: '1.5s', color: '#ffe066' },
]

function StarShape({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <path
        d="M10 0 L11.8 7.5 L20 10 L11.8 12.5 L10 20 L8.2 12.5 L0 10 L8.2 7.5 Z"
        fill={color}
      />
    </svg>
  )
}

const RAY_COLORS = ['#ff2d78', '#bf00ff', '#66ccff', '#ffffff', '#ff9900', '#ff2d78', '#bf00ff', '#66ccff']
const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

function DiscoBall({ left, top, size, floatDelay, spinDuration, sparkleOffset }: typeof BALLS[0]) {
  const rayLength = size * 2.4

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        animation: `float 6s ease-in-out infinite`,
        animationDelay: floatDelay,
        zIndex: 0,
      }}
    >
      {/* Light rays */}
      <div
        style={{
          position: 'absolute',
          top: size / 2,
          left: size / 2,
          animation: `discospin ${spinDuration} linear infinite reverse`,
        }}
      >
        {RAY_ANGLES.map((angle, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 2,
              height: rayLength,
              background: `linear-gradient(to bottom, ${RAY_COLORS[i]}cc, transparent)`,
              transform: `rotate(${angle}deg)`,
              transformOrigin: '50% 0%',
              top: 0,
              left: -1,
              opacity: 0.55,
            }}
          />
        ))}
      </div>

      {/* ✨ Sparkle stars */}
      {SPARKLE_POSITIONS.map((sp, i) => {
        const starSize = size * 0.13 + (i % 3) * 3
        const cx = size / 2 + sp.x * size * 0.72
        const cy = size / 2 + sp.y * size * 0.72
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cx - starSize / 2,
              top: cy - starSize / 2,
              width: starSize,
              height: starSize,
              animation: `${i % 2 === 0 ? 'sparkle' : 'sparkle2'} ${sp.dur} ease-in-out infinite`,
              animationDelay: `${parseFloat(sp.delay) + sparkleOffset}s`,
              filter: `drop-shadow(0 0 5px ${sp.color})`,
              zIndex: 2,
            }}
          >
            <StarShape color={sp.color} size={starSize} />
          </div>
        )
      })}

      {/* Real disco ball image — background removed via Python/PIL, so no blend tricks needed */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/disco-ball.png"
        alt=""
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          display: 'block',
          position: 'relative',
          zIndex: 1,
          animation: `discospin ${spinDuration} linear infinite`,
          filter: 'drop-shadow(0 8px 32px rgba(255,45,120,0.35))',
        }}
      />
    </div>
  )
}

export default function DiscoBackground() {
  return (
    <div
      aria-hidden
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}
    >
      {BALLS.map((ball, i) => (
        <DiscoBall key={i} {...ball} />
      ))}

      <div style={{ position: 'absolute', top: '-5%', left: '25%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,45,120,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '35%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,0,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
    </div>
  )
}
