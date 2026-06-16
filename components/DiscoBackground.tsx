'use client'

const BALLS = [
  { left: '2%',  top: '1%',  size: 220, floatDelay: '0s',   spinDuration: '8s',  sparkleOffset: 0   },
  { left: '66%', top: '0%',  size: 165, floatDelay: '2.5s', spinDuration: '11s', sparkleOffset: 3   },
  { left: '82%', top: '16%', size: 130, floatDelay: '1.2s', spinDuration: '9s',  sparkleOffset: 1.5 },
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
  const rayLength = size * 2.6

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: size,
        height: size,
        animation: `float 6s ease-in-out infinite`,
        animationDelay: floatDelay,
      }}
    >
      {/* 1. Ball image — rendered first so it's behind everything else */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/disco-ball.png"
        alt=""
        style={{
          position: 'absolute',
          width: size,
          height: size,
          objectFit: 'cover',
          display: 'block',
          top: 0,
          left: 0,
          borderRadius: '50%',
          animation: `discospin ${spinDuration} linear infinite`,
        }}
      />

      {/* 2. Light rays — rendered AFTER img in DOM, so they paint on top */}
      <div
        style={{
          position: 'absolute',
          top: size / 2,
          left: size / 2,
          width: 0,
          height: 0,
          animation: `discospin ${spinDuration} linear infinite reverse`,
        }}
      >
        {RAY_ANGLES.map((angle, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 3,
              height: rayLength * 2,
              top: -rayLength,
              left: -1.5,
              background: `linear-gradient(to bottom, transparent 0%, ${RAY_COLORS[i]}99 35%, ${RAY_COLORS[i]}cc 50%, ${RAY_COLORS[i]}99 65%, transparent 100%)`,
              transform: `rotate(${angle}deg)`,
              transformOrigin: '50% 50%',
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      {/* 3. Sparkle stars — on top of everything */}
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
            }}
          >
            <StarShape color={sp.color} size={starSize} />
          </div>
        )
      })}
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
