import { useGLTF, useTexture } from "@react-three/drei"
import { useEffect, useRef } from "react"
import { Texture, Mesh, SRGBColorSpace, RepeatWrapping } from 'three'

export default function Pose({ modelName, nftId }: any){

    const externalURL = `https://cdn.hellomoon.io/public/claynos/poses/final-${modelName}.gltf.glb`

    // Url Temporaire -> A remplacer par l'externalUrl 
    // et transmettre le modelName en props au composant
    const { scene } = useGLTF('/models/ankylo.glb')

    const textureShaderA = useRef<Texture | null>(null)
    const textureShaderB = useRef<Texture | null>(null)

    const loadTexture = (url: string)=>{
        const texture = useTexture(url)
        texture.flipY = false
        texture.colorSpace = SRGBColorSpace
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping
        texture.needsUpdate = true  

        return texture
    }

    if(nftId){
        textureShaderA.current = loadTexture(`https://cdn.hellomoon.io/public/claynos/textures/${nftId}_1001.jpg`)   
        textureShaderB.current = loadTexture(`https://cdn.hellomoon.io/public/claynos/textures/${nftId}_1002.jpg`)    
    }   
    
    useEffect(()=>{
        if(nftId){      
            scene.traverse((child)=>{
                if(child instanceof Mesh){
                    const materials = Array.isArray(child.material)
                    ? child.material
                    : [child.material]
                    materials.forEach((material)=>{
                        if(material.name === "Shader_A"){
                            material.map = textureShaderA.current                           
                        }
                        else if(material.name === "Shader_B"){
                            material.map = textureShaderB.current 
                        }
 
                        material.metalness = 0.5
                        material.roughness = 1
                        material.needsUpdate = true
                    })
                }
            })   
        }
    },[])

    return(
        <primitive object={scene} scale={0.7}/>
    )
}