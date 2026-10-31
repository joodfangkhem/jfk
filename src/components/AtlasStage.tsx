'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export type AtlasMarker = {
  id: string
  code: string
  x: number
  y: number
  z: number
  bilateral: boolean
  verified: boolean
}

type Props = {
  modelUrl: string
  markers: AtlasMarker[]
  selectedId?: string | null
  onSelectMarker?: (id: string) => void
  /** โหมดแอดมิน: คลิกบนตัวสัตว์แล้วได้พิกัดกลับไป */
  pickMode?: boolean
  onPick?: (p: { x: number; y: number; z: number }) => void
  className?: string
  loadingText?: string
  errorText?: string
}

const COLOR = {
  verified: 0x0d7c66,
  pending: 0xa1670a,
  selected: 0xb6452a,
  body: 0xd9d3c4,
  stage: 0xf4f1e8,
}

/**
 * ตัวแสดงโมเดล 3 มิติ + หมุดจุดฝังเข็ม
 * โหลด three ทั้งก้อน (~600 KB) จึงต้องถูกเรียกผ่าน dynamic import ที่ปิด ssr เสมอ
 * ไม่งั้นหน้าที่ import มันจะกลายเป็น client bundle ทั้งหน้า
 */
export default function AtlasStage({
  modelUrl,
  markers,
  selectedId,
  onSelectMarker,
  pickMode = false,
  onPick,
  className,
  loadingText = 'กำลังโหลดโมเดล…',
  errorText = 'โหลดโมเดลไม่สำเร็จ',
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const modelRef = useRef<THREE.Object3D | null>(null)
  const pinsRef = useRef<THREE.Group | null>(null)
  const bodyRef = useRef<THREE.Mesh[]>([])
  const sizeRef = useRef(1)

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  // ค่าที่ event handler ต้องอ่านล่าสุด โดยไม่ต้องผูก listener ใหม่ทุกครั้ง
  const pickModeRef = useRef(pickMode)
  const onPickRef = useRef(onPick)
  const onSelectRef = useRef(onSelectMarker)
  useEffect(() => {
    pickModeRef.current = pickMode
    onPickRef.current = onPick
    onSelectRef.current = onSelectMarker
  }, [pickMode, onPick, onSelectMarker])

  const fit = useCallback(() => {
    const model = modelRef.current
    const camera = cameraRef.current
    const controls = controlsRef.current
    if (!model || !camera || !controls) return
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const d = Math.max(size.x, size.y, size.z)
    sizeRef.current = d
    controls.target.copy(center)
    // มุมเริ่มต้นเป็นมุมด้านข้างค่อนหน้า — มุมที่ตำราฝังเข็มใช้วาดแผนภาพ
    // เห็นแนวสันหลัง ซี่โครง และขาทั้งสี่พร้อมกัน ต่างจากมุมหน้าตรงที่ลำตัวถูกบัง
    camera.position.set(center.x + d * 1.25, center.y + d * 0.3, center.z + d * 0.5)
    camera.near = d / 100
    camera.far = d * 40
    camera.updateProjectionMatrix()
    controls.minDistance = d * 0.45
    controls.maxDistance = d * 3
    controls.update()
  }, [])

  // ---- ตั้งฉาก (ทำครั้งเดียวต่อโมเดลหนึ่งตัว)
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(COLOR.stage)
    const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.touchAction = 'none'

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false

    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8575, 2.0))
    const key = new THREE.DirectionalLight(0xffffff, 1.5)
    key.position.set(2, 4, 3)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffffff, 0.45)
    fill.position.set(-3, 1, -2)
    scene.add(fill)

    const pins = new THREE.Group()
    scene.add(pins)

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer
    controlsRef.current = controls
    pinsRef.current = pins

    const draco = new DRACOLoader()
    draco.setDecoderPath('/draco/')
    const loader = new GLTFLoader()
    loader.setDRACOLoader(draco)

    let disposed = false
    setStatus('loading')
    loader.load(
      modelUrl,
      (gltf) => {
        if (disposed) return
        const bodies: THREE.Mesh[] = []
        gltf.scene.traverse((o) => {
          const m = o as THREE.Mesh
          if (!m.isMesh) return
          m.material = new THREE.MeshStandardMaterial({
            color: COLOR.body,
            roughness: 0.68,
            metalness: 0.02,
          })
          bodies.push(m)
        })
        bodyRef.current = bodies
        modelRef.current = gltf.scene
        scene.add(gltf.scene)
        fit()
        setStatus('ready')
      },
      undefined,
      () => {
        if (!disposed) setStatus('error')
      }
    )

    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    renderer.setAnimationLoop(() => {
      controls.update()
      renderer.render(scene, camera)
    })

    // ---- คลิก: แยกคลิกจริงออกจากการลากหมุน
    const ray = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    let down: { x: number; y: number } | null = null

    const onDown = (e: PointerEvent) => {
      down = { x: e.clientX, y: e.clientY }
    }
    const onUp = (e: PointerEvent) => {
      if (!down) return
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y)
      down = null
      if (moved > 6 || !modelRef.current) return

      const r = renderer.domElement.getBoundingClientRect()
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1
      ray.setFromCamera(ndc, camera)

      // หมุดอยู่หน้าสุดเสมอ เช็คก่อนตัวสัตว์
      const onPin = ray.intersectObjects(pins.children, true)[0]
      if (onPin) {
        const id = onPin.object.userData.pointId as string | undefined
        if (id && onSelectRef.current) onSelectRef.current(id)
        return
      }

      if (!pickModeRef.current || !onPickRef.current) return
      const hit = ray.intersectObjects(bodyRef.current, true)[0]
      if (!hit) return
      const local = modelRef.current.worldToLocal(hit.point.clone())
      onPickRef.current({ x: local.x, y: local.y, z: local.z })
    }

    renderer.domElement.addEventListener('pointerdown', onDown)
    renderer.domElement.addEventListener('pointerup', onUp)

    return () => {
      disposed = true
      ro.disconnect()
      renderer.setAnimationLoop(null)
      renderer.domElement.removeEventListener('pointerdown', onDown)
      renderer.domElement.removeEventListener('pointerup', onUp)
      controls.dispose()
      draco.dispose()
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.isMesh) {
          m.geometry?.dispose()
          const mat = m.material
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
          else mat?.dispose()
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
      modelRef.current = null
      bodyRef.current = []
    }
  }, [modelUrl, fit])

  // ---- วาดหมุดใหม่เมื่อรายการจุดหรือจุดที่เลือกเปลี่ยน
  useEffect(() => {
    const pins = pinsRef.current
    const model = modelRef.current
    if (!pins || !model || status !== 'ready') return

    pins.clear()
    const r = sizeRef.current * 0.011
    const geo = new THREE.SphereGeometry(r, 14, 10)
    const geoBig = new THREE.SphereGeometry(r * 1.7, 18, 12)

    for (const mk of markers) {
      const isSel = mk.id === selectedId
      const color = isSel ? COLOR.selected : mk.verified ? COLOR.verified : COLOR.pending
      const mat = new THREE.MeshBasicMaterial({ color })
      const sides = mk.bilateral ? [1, -1] : [1]
      for (const s of sides) {
        const pin = new THREE.Mesh(isSel ? geoBig : geo, mat)
        pin.position.copy(model.localToWorld(new THREE.Vector3(mk.x * s, mk.y, mk.z)))
        pin.renderOrder = isSel ? 2 : 1
        pin.userData.pointId = mk.id
        pins.add(pin)
      }
    }

    // เลือกจุดที่อยู่อีกฝั่งของลำตัวจากรายการ แล้วหมุนกล้องไปหาให้
    // (ถ้าจุดนั้นหันเข้าหากล้องอยู่แล้ว ปล่อยมุมไว้เหมือนเดิม ไม่งั้นคลิกหมุดทีกล้องกระตุกที)
    const camera = cameraRef.current
    const controls = controlsRef.current
    const sel = markers.find((m) => m.id === selectedId)
    if (!sel || !camera || !controls) return

    const center = controls.target
    const toCam = camera.position.clone().sub(center).normalize()
    const sides = sel.bilateral ? [1, -1] : [1]
    let best: THREE.Vector3 | null = null
    let bestDot = -Infinity
    for (const s of sides) {
      const p = model.localToWorld(new THREE.Vector3(sel.x * s, sel.y, sel.z))
      const dot = p.clone().sub(center).normalize().dot(toCam)
      if (dot > bestDot) {
        bestDot = dot
        best = p
      }
    }
    if (!best || bestDot >= 0.15) return

    const dir = best.sub(center)
    dir.y = Math.abs(dir.y) * 0.4 + sizeRef.current * 0.12
    if (dir.lengthSq() < 1e-12) return
    const dist = camera.position.distanceTo(center)
    camera.position.copy(center).add(dir.normalize().multiplyScalar(dist))
    controls.update()
  }, [markers, selectedId, status])

  return (
    <div className={className ?? 'relative w-full h-[420px]'}>
      <div ref={mountRef} className="w-full h-full rounded-[var(--radius)] overflow-hidden" />
      {status !== 'ready' && (
        <div className="absolute inset-0 grid place-items-center text-sm text-muted">
          {status === 'loading' ? loadingText : errorText}
        </div>
      )}
    </div>
  )
}
