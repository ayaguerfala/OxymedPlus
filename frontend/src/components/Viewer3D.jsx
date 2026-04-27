import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'

const RotatingProduct = () => {
  const meshRef = useRef()

  useFrame(() => {
    meshRef.current.rotation.y += 0.01
  })

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 100, 16]} />
      <meshStandardMaterial color="#2E6DA4" />
    </mesh>
  )
}

const Viewer3D = () => {
  return (
    <div style={{ height: "300px", width: "100%" }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <RotatingProduct />
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  )
}

export default Viewer3D