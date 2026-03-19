import bird from '../assets/bird.png'

export default function HakkiEyeLogo({ size = 44 }) {
  return (
    <img
      src={bird}
      alt="HakkiEye"
      width={size}
      height={size}
      style={{ display: 'block' }}
    />
  )
}
