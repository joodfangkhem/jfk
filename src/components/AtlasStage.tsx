'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Hand, Maximize2, Minus, Plus, Rotate3d } from 'lucide-react'

export type AtlasMarker = {
  id: string
  code: string
  x: number
  y: number
  z: number
  bilateral: boolean
  verified: boolean
  /** ตัวคูณขนาดหมุด 1 = ขนาดมาตรฐาน */
  scale?: number
}

/** รัศมีหมุดมาตรฐาน เทียบกับด้านที่ยาวที่สุดของโมเดล */
const PIN_RADIUS = 0.006

/** เลื่อนจุดหมุนออกจากกลางโมเดลได้ไกลสุดเท่าไร (เท่าของด้านที่ยาวที่สุด) */
const PAN_LIMIT = 0.6

export type AtlasLabels = {
  rotate: string
  pan: string
  zoomIn: string
  zoomOut: string
  reset: string
}

const TH_LABELS: AtlasLabels = {
  rotate: 'โหมดหมุน (ลากเพื่อหมุน)',
  pan: 'โหมดเลื่อน (ลากเพื่อเลื่อนภาพ)',
  zoomIn: 'ซูมเข้า',
  zoomOut: 'ซูมออก',
  reset: 'กลับมุมมองเริ่มต้น',
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
  labels?: AtlasLabels
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
  labels = TH_LABELS,
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
  /** กลางโมเดล ใช้เป็นหลักยึดไม่ให้เลื่อนภาพหลุดออกไปจนหาตัวสัตว์ไม่เจอ */
  const centerRef = useRef(new THREE.Vector3())
  /** จุดที่กล้องกำลังเลื่อนเข้าไปหา (แตะสองครั้ง / เลือกจุดที่อยู่นอกจอ) */
  const focusRef = useRef<THREE.Vector3 | null>(null)
  /** โหมดเลื่อนเปิดอยู่ไหม — listener ที่ผูกครั้งเดียวต้องอ่านค่าล่าสุด */
  const panModeRef = useRef(false)
  // หมุดทุกอันใช้ทรงกลมหนึ่งใบกับวัสดุสามสีร่วมกัน แล้วย่อ/ขยายเอา
  // (วาดหมุดใหม่ทุกครั้งที่เลือกจุด ถ้าสร้าง geometry ใหม่ทุกรอบจะรั่ว)
  const pinGeoRef = useRef<THREE.SphereGeometry | null>(null)
  const matsRef = useRef<{
    verified: THREE.MeshBasicMaterial
    pending: THREE.MeshBasicMaterial
    selected: THREE.MeshBasicMaterial
  } | null>(null)

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  // ปุ่มสลับโหมดสำคัญกับมือถือ: สองนิ้วเพื่อเลื่อนภาพทำยากบนจอเล็ก
  // และบนเดสก์ท็อปน้อยคนรู้ว่าลากด้วยปุ่มขวาคือการเลื่อน
  const [mode, setMode] = useState<'rotate' | 'pan'>('rotate')

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
    centerRef.current.copy(center)
    focusRef.current = null
    controls.target.copy(center)
    // มุมเริ่มต้นเป็นมุมด้านข้างค่อนหน้า — มุมที่ตำราฝังเข็มใช้วาดแผนภาพ
    // เห็นแนวสันหลัง ซี่โครง และขาทั้งสี่พร้อมกัน ต่างจากมุมหน้าตรงที่ลำตัวถูกบัง
    camera.position.set(center.x + d * 1.25, center.y + d * 0.3, center.z + d * 0.5)
    camera.near = d / 200
    camera.far = d * 40
    camera.updateProjectionMatrix()
    // เข้าได้ใกล้กว่าเดิมมาก (เดิม 0.45 ของตัวสัตว์ = ซูมดูจุดเดียวไม่ได้เลย)
    controls.minDistance = d * 0.1
    controls.maxDistance = d * 3
    controls.update()
  }, [])

  /** ซูมด้วยปุ่ม — คนที่ใช้ทัชแพดหรือจอสัมผัสมักหาทางซูมไม่เจอ */
  const zoomBy = useCallback((factor: number) => {
    const camera = cameraRef.current
    const controls = controlsRef.current
    if (!camera || !controls) return
    const dir = camera.position.clone().sub(controls.target)
    const dist = THREE.MathUtils.clamp(
      dir.length() * factor,
      controls.minDistance,
      controls.maxDistance
    )
    camera.position.copy(controls.target).add(dir.normalize().multiplyScalar(dist))
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
    // เลื่อนภาพได้ — ไม่งั้นพอซูมเข้าใกล้แล้วดูส่วนอื่นของตัวสัตว์ไม่ได้เลย
    controls.enablePan = true
    controls.screenSpacePanning = true
    controls.panSpeed = 1
    // ซูมเข้าหาตำแหน่งเมาส์ ทำให้เลื่อนไปดูส่วนที่ต้องการได้ด้วยล้อเดียว
    controls.zoomToCursor = true
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.PAN,
    }
    controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }
    // ลูกศรบนคีย์บอร์ดเลื่อนภาพได้เมื่อโฟกัสอยู่ที่ฉาก (ผูกกับ mount ไม่ใช่ window
    // ไม่งั้นลูกศรของทั้งหน้าจะถูกยึดไป)
    controls.keyPanSpeed = 14
    controls.listenToKeyEvents(mount)

    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8575, 2.0))
    const key = new THREE.DirectionalLight(0xffffff, 1.5)
    key.position.set(2, 4, 3)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffffff, 0.45)
    fill.position.set(-3, 1, -2)
    scene.add(fill)

    const pins = new THREE.Group()
    scene.add(pins)

    pinGeoRef.current = new THREE.SphereGeometry(1, 16, 12)
    matsRef.current = {
      verified: new THREE.MeshBasicMaterial({ color: COLOR.verified }),
      pending: new THREE.MeshBasicMaterial({ color: COLOR.pending }),
      selected: new THREE.MeshBasicMaterial({ color: COLOR.selected }),
    }

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

    /** กันเลื่อนภาพหลุดกรอบ — ขยับกล้องตามไปด้วยเพื่อให้แค่ "ชน" ขอบ ไม่ใช่ภาพกระตุก */
    const clampPan = () => {
      const t = controls.target
      const c = centerRef.current
      const lim = sizeRef.current * PAN_LIMIT
      const nx = THREE.MathUtils.clamp(t.x, c.x - lim, c.x + lim)
      const ny = THREE.MathUtils.clamp(t.y, c.y - lim, c.y + lim)
      const nz = THREE.MathUtils.clamp(t.z, c.z - lim, c.z + lim)
      if (nx === t.x && ny === t.y && nz === t.z) return
      camera.position.add(new THREE.Vector3(nx - t.x, ny - t.y, nz - t.z))
      t.set(nx, ny, nz)
    }

    renderer.setAnimationLoop(() => {
      // เลื่อนกล้องเข้าหาจุดที่สั่งโฟกัสแบบนุ่ม ๆ (กล้องกับเป้าขยับพร้อมกัน ระยะห่างคงเดิม)
      const focus = focusRef.current
      if (focus) {
        const step = focus.clone().sub(controls.target)
        if (step.length() < sizeRef.current * 0.002) {
          camera.position.add(step)
          controls.target.copy(focus)
          focusRef.current = null
        } else {
          step.multiplyScalar(0.16)
          controls.target.add(step)
          camera.position.add(step)
        }
      }
      controls.update()
      clampPan()
      renderer.render(scene, camera)
    })

    // ---- คลิก: แยกคลิกจริงออกจากการลากหมุน / แตะสองครั้ง = โฟกัสตรงนั้น
    const ray = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    let down: { x: number; y: number } | null = null
    let lastTap = { t: 0, x: 0, y: 0 }

    /** หาจุดบนฉากที่อยู่ใต้ตำแหน่งนิ้ว/เมาส์ */
    const hitAt = (clientX: number, clientY: number) => {
      const r = renderer.domElement.getBoundingClientRect()
      ndc.x = ((clientX - r.left) / r.width) * 2 - 1
      ndc.y = -((clientY - r.top) / r.height) * 2 + 1
      ray.setFromCamera(ndc, camera)
      const onPin = ray.intersectObjects(pins.children, true)[0]
      if (onPin) return { kind: 'pin' as const, hit: onPin }
      const onBody = ray.intersectObjects(bodyRef.current, true)[0]
      if (onBody) return { kind: 'body' as const, hit: onBody }
      return null
    }

    const onDown = (e: PointerEvent) => {
      down = { x: e.clientX, y: e.clientY }
    }
    const onUp = (e: PointerEvent) => {
      if (!down) return
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y)
      down = null
      if (moved > 6 || !modelRef.current) return

      const now = performance.now()
      const isDouble =
        now - lastTap.t < 320 && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 24
      lastTap = { t: now, x: e.clientX, y: e.clientY }

      const found = hitAt(e.clientX, e.clientY)

      // แตะ/คลิกสองครั้งบนตัวสัตว์ = ย้ายจุดหมุนไปที่นั้น แล้วหมุนกับซูมรอบจุดนั้นได้
      // ทางที่เร็วที่สุดในการ "ไปดูอีกด้าน" ตอนซูมเข้ามาแล้ว
      if (isDouble && found) {
        focusRef.current = found.hit.point.clone()
        return
      }

      // หมุดอยู่หน้าสุดเสมอ เช็คก่อนตัวสัตว์
      if (found?.kind === 'pin') {
        const id = found.hit.object.userData.pointId as string | undefined
        if (id && onSelectRef.current) onSelectRef.current(id)
        return
      }

      if (!pickModeRef.current || !onPickRef.current) return
      if (found?.kind !== 'body') return
      const local = modelRef.current.worldToLocal(found.hit.point.clone())
      onPickRef.current({ x: local.x, y: local.y, z: local.z })
    }

    // Shift + ลาก = เลื่อนภาพ ทั้งที่ยังอยู่โหมดหมุน (ทางลัดที่คนใช้โปรแกรม 3D คุ้นมือ)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') controls.mouseButtons.LEFT = THREE.MOUSE.PAN
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key !== 'Shift') return
      controls.mouseButtons.LEFT = panModeRef.current ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE
    }

    renderer.domElement.addEventListener('pointerdown', onDown)
    renderer.domElement.addEventListener('pointerup', onUp)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      disposed = true
      ro.disconnect()
      renderer.setAnimationLoop(null)
      renderer.domElement.removeEventListener('pointerdown', onDown)
      renderer.domElement.removeEventListener('pointerup', onUp)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
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
      pinGeoRef.current = null
      matsRef.current = null
      modelRef.current = null
      bodyRef.current = []
      focusRef.current = null
    }
  }, [modelUrl, fit])

  // ---- โหมดหมุน/เลื่อน: เปลี่ยนความหมายของการลากหนึ่งนิ้วและปุ่มซ้าย
  useEffect(() => {
    panModeRef.current = mode === 'pan'
    const controls = controlsRef.current
    const renderer = rendererRef.current
    if (!controls) return
    const pan = mode === 'pan'
    controls.mouseButtons.LEFT = pan ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE
    controls.touches.ONE = pan ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE
    if (renderer) renderer.domElement.style.cursor = pan ? 'grab' : 'default'
  }, [mode])

  // ---- วาดหมุดใหม่เมื่อรายการจุดหรือจุดที่เลือกเปลี่ยน
  useEffect(() => {
    const pins = pinsRef.current
    const model = modelRef.current
    if (!pins || !model || status !== 'ready') return

    pins.clear()
    const geo = pinGeoRef.current
    const mats = matsRef.current
    if (!geo || !mats) return

    const base = sizeRef.current * PIN_RADIUS
    for (const mk of markers) {
      const isSel = mk.id === selectedId
      // ตอนแอดมินกำลังปรับขนาด หมุดที่เลือกต้องเป็นขนาดจริง ไม่งั้นปรับแล้วอ่านผลไม่ได้
      // หน้า public ขยายนิดหน่อยให้หาเจอง่ายตอนเลือกจากรายการ
      const emphasis = isSel && !pickMode ? 1.25 : 1
      const r = base * (mk.scale ?? 1) * emphasis
      const sides = mk.bilateral ? [1, -1] : [1]
      for (const s of sides) {
        const pin = new THREE.Mesh(geo, isSel ? mats.selected : mk.verified ? mats.verified : mats.pending)
        pin.scale.setScalar(r)
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
    if (!best) return

    // ซูมเข้ามาแล้วเลือกจุดอื่นจากรายการ หมุดนั้นมักอยู่นอกจอ — เลื่อนภาพไปหาให้
    // (เช็คตำแหน่งบนจอก่อนย้าย ถ้ายังเห็นอยู่กลาง ๆ ไม่ต้องขยับ)
    const onScreen = best.clone().project(camera)
    const offScreen = onScreen.z > 1 || Math.abs(onScreen.x) > 0.72 || Math.abs(onScreen.y) > 0.72
    if (offScreen) focusRef.current = best.clone()

    if (bestDot >= 0.15) return

    const dir = best.clone().sub(center)
    dir.y = Math.abs(dir.y) * 0.4 + sizeRef.current * 0.12
    if (dir.lengthSq() < 1e-12) return
    const dist = camera.position.distanceTo(center)
    camera.position.copy(center).add(dir.normalize().multiplyScalar(dist))
    controls.update()
  }, [markers, selectedId, status, pickMode])

  const btn =
    'grid place-items-center w-9 h-9 rounded-md bg-surface/90 border border-border text-text ' +
    'hover:border-primary hover:text-primary active:scale-95 transition disabled:opacity-40'

  return (
    <div className={className ?? 'relative w-full h-[420px]'}>
      <div
        ref={mountRef}
        tabIndex={0}
        className="w-full h-full rounded-[var(--radius)] overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
      />
      {status === 'ready' && (
        <div className="absolute right-3 bottom-3 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setMode((m) => (m === 'rotate' ? 'pan' : 'rotate'))}
            className={
              mode === 'pan' ? `${btn} border-primary text-primary bg-surface` : btn
            }
            aria-pressed={mode === 'pan'}
            title={mode === 'pan' ? labels.rotate : labels.pan}
            aria-label={mode === 'pan' ? labels.rotate : labels.pan}
          >
            {mode === 'pan' ? <Hand size={16} /> : <Rotate3d size={16} />}
          </button>
          <button type="button" onClick={() => zoomBy(0.7)} className={btn} title={labels.zoomIn} aria-label={labels.zoomIn}>
            <Plus size={16} />
          </button>
          <button type="button" onClick={() => zoomBy(1 / 0.7)} className={btn} title={labels.zoomOut} aria-label={labels.zoomOut}>
            <Minus size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              fit()
              setMode('rotate')
            }}
            className={btn}
            title={labels.reset}
            aria-label={labels.reset}
          >
            <Maximize2 size={16} />
          </button>
        </div>
      )}
      {status !== 'ready' && (
        <div className="absolute inset-0 grid place-items-center text-sm text-muted">
          {status === 'loading' ? loadingText : errorText}
        </div>
      )}
    </div>
  )
}
