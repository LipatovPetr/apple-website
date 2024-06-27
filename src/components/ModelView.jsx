import { OrbitControls, PerspectiveCamera, View } from "@react-three/drei";

import * as THREE from "three";
import Lights from "./Lights";
import Loader from "./Loader";
import IPhone from "./Iphone";
import { Suspense, useEffect } from "react";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ModelView = ({
  index,
  groupRef,
  gsapType,
  controlRef,
  setRotationState,
  size,
  item,
}) => {
  // useEffect(() => {
  //   if (groupRef.current) {
  //     ScrollTrigger.create({
  //       trigger: groupRef.current,
  //       start: "top 80%",
  //       onEnter: () => {
  //         gsap.to(groupRef.current.rotation, {
  //           y: "+=1.5708", // 90 градусов (PI/2 радиан)
  //           duration: 2, // Длительность анимации
  //           delay: 2, // Задержка перед началом анимации
  //           ease: "power2.inOut", // Плавная анимация
  //         });
  //       },
  //     });
  //   }
  // }, []);

  return (
    <View
      index={index}
      id={gsapType}
      className={`w-full h-full absolute ${index === 2 ? "right-[-100%]" : ""}`}
    >
      {/* Ambient Light */}
      <ambientLight intensity={0.3} />

      <PerspectiveCamera makeDefault position={[0, 0, 4]} />

      <Lights />

      <OrbitControls
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={new THREE.Vector3(0, 0, 0)}
        onEnd={() => setRotationState(controlRef.current.getAzimuthalAngle())}
      />

      <group
        ref={groupRef}
        name={`${index === 1} ? 'small' : 'large`}
        position={[0, 0, 0]}
      >
        <Suspense fallback={<Loader />}>
          <IPhone
            scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
            item={item}
            size={size}
          />
        </Suspense>
      </group>
    </View>
  );
};

export default ModelView;
