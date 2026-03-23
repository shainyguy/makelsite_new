import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PresentationControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Palette, RotateCcw, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '../components/Layout.jsx';

// 3D Switch Component
function Switch3D({ color = '#ffffff', position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[1.2, 1.8, 0.15]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Key */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <RoundedBox args={[0.8, 1.2, 0.1]} radius={0.05} smoothness={4} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
      </mesh>
      
      {/* Indicator light */}
      <mesh position={[0.35, 0.7, 0.02]}>
        <circleGeometry args={[0.03, 16]} />
        <meshBasicMaterial color="#ffeb3b" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// 3D Socket Component
function Socket3D({ color = '#ffffff', position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[1.2, 1.8, 0.15]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Faceplate */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <RoundedBox args={[0.9, 1.4, 0.08]} radius={0.05} smoothness={4} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
      </mesh>
      
      {/* Socket holes */}
      <mesh position={[-0.15, 0.1, 0.05]}>
        <circleGeometry args={[0.08, 16]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      <mesh position={[0.15, 0.1, 0.05]}>
        <circleGeometry args={[0.08, 16]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      <mesh position={[0, -0.15, 0.05]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
    </group>
  );
}

// 3D Scene
function Scene({ productType, frameColor, keyColor }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }}
      >
        {productType === 'switch' ? (
          <Switch3D color={keyColor} position={[0, 0, 0]} />
        ) : (
          <Socket3D color={frameColor} position={[0, 0, 0]} />
        )}
      </PresentationControls>
      
      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} blur={2.5} far={4} />
      <Environment preset="city" />
    </>
  );
}

export default function Viewer3D() {
  const [productType, setProductType] = useState('switch'); // 'switch' | 'socket'
  const [frameColor, setFrameColor] = useState('#ffffff');
  const [keyColor, setKeyColor] = useState('#ffffff');
  const [series, setSeries] = useState('lillium');
  const [autoRotate, setAutoRotate] = useState(true);

  const colors = [
    { id: 'white', name: 'Белый', hex: '#ffffff' },
    { id: 'cream', name: 'Крем', hex: '#fef3c7' },
    { id: 'gray', name: 'Серый', hex: '#64748b' },
    { id: 'black', name: 'Чёрный', hex: '#1e293b' },
    { id: 'gold', name: 'Золото', hex: '#fbbf24' },
    { id: 'silver', name: 'Серебро', hex: '#94a3b8' },
    { id: 'red', name: 'Красный', hex: '#dc2626' },
    { id: 'blue', name: 'Синий', hex: '#2563eb' },
  ];

  const seriesList = [
    { id: 'lillium', name: 'Lillium', desc: 'Классический дизайн' },
    { id: 'mimoza', name: 'Mimoza', desc: 'Плавные линии' },
    { id: 'defne', name: 'Defne', desc: 'Современный стиль' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">3D Визуализация</span>
            <h1 className="text-4xl font-bold text-slate-900 mt-2 mb-2">Электроустановочные изделия в 3D</h1>
            <p className="text-slate-600">Вращайте, масштабируйте и оценивайте продукцию с разных ракурсов</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 3D Viewer */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="h-[500px] bg-gradient-to-b from-slate-100 to-white relative">
                  <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
                    <Scene 
                      productType={productType} 
                      frameColor={frameColor} 
                      keyColor={keyColor}
                    />
                    <OrbitControls 
                      autoRotate={autoRotate}
                      autoRotateSpeed={2}
                      enablePan={false}
                      minDistance={2}
                      maxDistance={6}
                    />
                  </Canvas>
                  
                  {/* Controls Overlay */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <button 
                      onClick={() => setAutoRotate(!autoRotate)}
                      className={`p-2 rounded-lg transition-colors ${autoRotate ? 'bg-red-100 text-red-600' : 'hover:bg-slate-100'}`}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-slate-200" />
                    <span className="text-sm text-slate-600">Зажмите лКМ для вращения</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {seriesList.find(s => s.id === series)?.name} — {productType === 'switch' ? 'Выключатель' : 'Розетка'}
                      </h3>
                      <p className="text-slate-500 mt-1">
                        {seriesList.find(s => s.id === series)?.desc}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setProductType('switch')}
                        className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                          productType === 'switch' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Выключатель
                      </button>
                      <button 
                        onClick={() => setProductType('socket')}
                        className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                          productType === 'socket' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Розетка
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="space-y-6">
              {/* Series Selection */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-red-600" />
                  Серия
                </h3>
                <div className="space-y-2">
                  {seriesList.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSeries(s.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        series === s.id 
                          ? 'bg-red-50 border-2 border-red-200' 
                          : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-medium text-slate-900">{s.name}</div>
                      <div className="text-sm text-slate-500">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Цвет рамки</h3>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setFrameColor(c.hex)}
                      className={`aspect-square rounded-xl border-2 transition-all ${
                        frameColor === c.hex 
                          ? 'border-red-500 ring-2 ring-red-200' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {productType === 'switch' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Цвет клавиши</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setKeyColor(c.hex)}
                        className={`aspect-square rounded-xl border-2 transition-all ${
                          keyColor === c.hex 
                            ? 'border-red-500 ring-2 ring-red-200' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-6 text-white text-center">
                <h3 className="font-bold text-lg mb-2">Нравится конфигурация?</h3>
                <p className="text-white/90 text-sm mb-4">Запросите коммерческое предложение</p>
                <button className="w-full py-3 bg-white text-red-600 rounded-xl font-bold hover:bg-yellow-300 transition-colors">
                  Запросить цену
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <RotateCcw className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Вращение</h4>
              <p className="text-slate-600 text-sm">Зажмите левую кнопку мыши и перетаскивайте для вращения модели</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <ZoomIn className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Масштаб</h4>
              <p className="text-slate-600 text-sm">Используйте колёсико мыши для приближения или отдаления</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Кастомизация</h4>
              <p className="text-slate-600 text-sm">Выбирайте разные цвета и серии для подбора идеального решения</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
