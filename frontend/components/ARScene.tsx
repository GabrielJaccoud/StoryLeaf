import React, { useEffect, useRef } from 'react';

interface ARSceneProps {
  bookId: number;
  arMarkers: any; // Pode ser mais tipado depois
}

const ARScene: React.FC<ARSceneProps> = ({ bookId, arMarkers }) => {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carregar A-Frame e AR.js dinamicamente para evitar problemas de SSR
    const loadAR = async () => {
      // @ts-ignore
      if (window.AFRAME && window.AR) {
        console.log('A-Frame and AR.js already loaded.');
        return;
      }

      const aframeScript = document.createElement('script');
      aframeScript.src = 'https://unpkg.com/aframe@1.5.0/dist/aframe-master.min.js';
      document.head.appendChild(aframeScript);

      aframeScript.onload = () => {
        const arjsScript = document.createElement('script');
        arjsScript.src = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js';
        document.head.appendChild(arjsScript);

        arjsScript.onload = () => {
          console.log('A-Frame and AR.js loaded successfully.');
          // Inicializar a cena AR após o carregamento
          initializeARScene();
        };
      };
    };

    loadAR();

    const initializeARScene = () => {
      if (!sceneRef.current) return;

      // Limpar cena existente
      sceneRef.current.innerHTML = '';

      const scene = document.createElement('a-scene');
      scene.setAttribute('embedded', '');
      scene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false;');
      scene.setAttribute('vr-mode-ui', 'enabled: false');

      // Adicionar câmera
      const camera = document.createElement('a-entity');
      camera.setAttribute('camera', '');
      scene.appendChild(camera);

      // Adicionar marcadores AR e modelos 3D
      if (arMarkers && arMarkers.scenes) {
        arMarkers.scenes.forEach((markerId: string) => {
          const marker = document.createElement('a-marker');
          marker.setAttribute('preset', 'hiro'); // Exemplo, pode ser dinâmico
          marker.setAttribute('value', markerId); // Valor do marcador

          // Adicionar modelo 3D (exemplo: um cubo)
          const entity = document.createElement("a-entity");
          entity.setAttribute("gltf-model", "url(/assets/3d/cube.glb)"); // Caminho para o modelo 3D
          entity.setAttribute("scale", "0.5 0.5 0.5");
          entity.setAttribute("position", "0 0.5 0");
          marker.appendChild(entity);
          scene.appendChild(marker);
        });
      }

      // Adicionar luz ambiente
      const ambientLight = document.createElement('a-entity');
      ambientLight.setAttribute('light', 'type: ambient; color: #BBB');
      scene.appendChild(ambientLight);

      // Adicionar luz direcional
      const directionalLight = document.createElement('a-entity');
      directionalLight.setAttribute('light', 'type: directional; color: #FFF; intensity: 0.6');
      directionalLight.setAttribute('position', '-0.5 1 1');
      scene.appendChild(directionalLight);

      sceneRef.current.appendChild(scene);

      return () => {
        // Limpar a cena quando o componente for desmontado
        if (sceneRef.current && scene.parentNode === sceneRef.current) {
          sceneRef.current.removeChild(scene);
        }
      };
    };
  }, [bookId, arMarkers]);

  return (
    <div ref={sceneRef} className="w-full h-full relative">
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white text-xl">
        Carregando cena de Realidade Aumentada...
      </div>
    </div>
  );
};

export default ARScene;

