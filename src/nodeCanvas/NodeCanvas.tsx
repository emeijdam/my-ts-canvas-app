import { useEffect, useRef, useState } from "react";

interface INode {
    name: string,
    type: string
}

interface NodeCanvasProps {
    width: number;
    height: number;
}

const NodeCanvas = (props: NodeCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [canvasNodes, setCanvasNodes] = useState<INode[]>([])

    useEffect(() => {
        const mynode: INode = { name: 'input1', type: "source" }
        setCanvasNodes([...canvasNodes, mynode])

        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const canvasContext = canvas.getContext('2d');
            if (canvasContext) {
                for (const node of canvasNodes) {
                    if (node.type === 'source') {
                        canvasContext.fillRect(100, 100, 100, 100)
                    }
                }
            }
        }
    }, [canvasNodes])

    return <canvas ref={canvasRef} {...props} />
}

export default NodeCanvas