import { useEffect, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import { useSceneState } from './useSceneState';

/**
 * Traverses a model's scene graph and temporarily boosts emissive color +
 * intensity on all MeshStandardMaterial children when the given section(s)
 * are hovered.
 *
 * Uses material cloning to avoid mutating shared materials across models.
 * Restores originals on unhover.
 */
export function useEmissiveGlow(
  rootRef: RefObject<THREE.Group | null>,
  sections: string | string[],
  glowColor: string,
  intensity: number = 1.5,
  nameFilter?: (name: string) => boolean,
) {
  const hoveredSection = useSceneState((s) => s.hoveredSection);
  const originalsRef = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map());
  const sectionList = Array.isArray(sections) ? sections : [sections];
  const isHovered = hoveredSection !== null && sectionList.includes(hoveredSection);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (isHovered) {
      const color = new THREE.Color(glowColor);

      root.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        if (nameFilter && !nameFilter(child.name) && !nameFilter(child.parent?.name ?? '')) return;

        const mat = child.material;
        if (!mat) return;

        // Handle both single material and material arrays
        if (Array.isArray(mat)) {
          // Store original array
          originalsRef.current.set(child, [...mat]);
          child.material = mat.map((m) => {
            if (m instanceof THREE.MeshStandardMaterial) {
              const clone = m.clone();
              clone.emissive = color.clone();
              clone.emissiveIntensity = intensity;
              return clone;
            }
            return m;
          });
        } else if (mat instanceof THREE.MeshStandardMaterial) {
          // Store original
          originalsRef.current.set(child, mat);
          const clone = mat.clone();
          clone.emissive = color.clone();
          clone.emissiveIntensity = intensity;
          child.material = clone;
        }
      });
    } else {
      // Restore originals
      for (const [mesh, original] of originalsRef.current) {
        // Dispose cloned materials
        const current = mesh.material;
        if (Array.isArray(current)) {
          current.forEach((m) => {
            if (!Array.isArray(original) || !original.includes(m)) {
              m.dispose();
            }
          });
        } else if (current !== original) {
          current.dispose();
        }

        mesh.material = original as THREE.Material & THREE.Material[];
      }
      originalsRef.current.clear();
    }

    // Cleanup on unmount
    return () => {
      for (const [mesh, original] of originalsRef.current) {
        const current = mesh.material;
        if (Array.isArray(current)) {
          current.forEach((m) => {
            if (!Array.isArray(original) || !original.includes(m)) {
              m.dispose();
            }
          });
        } else if (current !== original) {
          current.dispose();
        }
        mesh.material = original as THREE.Material & THREE.Material[];
      }
      originalsRef.current.clear();
    };
  }, [isHovered, glowColor, intensity, rootRef]);
}
