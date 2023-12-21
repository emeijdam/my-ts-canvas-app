import { useEffect, useRef, useState } from "react";


enum ENodeTypes {
    SOURCE,
    TRANSFORM,
    TERMINAL
}
interface INode {
    name: string,
    type: ENodeTypes
}

interface NodeCanvasProps {
    width: number;
    height: number;
}

const mySourceNode: INode = { name: 'input1', type: ENodeTypes.SOURCE }
const myTransformNode: INode = { name: 'input1', type: ENodeTypes.TRANSFORM }
const myTerminalNode: INode = { name: 'input1', type: ENodeTypes.TERMINAL }


const NodeCanvas = (props: NodeCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [canvasNodes, setCanvasNodes] = useState<INode[]>([mySourceNode, myTransformNode, myTerminalNode])

    useEffect(() => {

        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const canvasContext = canvas.getContext('2d');


            const startpos = { startX: 100, startY: 100 }

            if (canvasContext) {
                canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                for (const node of canvasNodes) {

                    if (node.type === ENodeTypes.SOURCE) {
                        canvasContext.beginPath();
                        canvasContext.arc(startpos.startX, startpos.startY, 50, 0, 2 * Math.PI);
                        canvasContext.stroke()
                    }

                    else if (node.type === ENodeTypes.TRANSFORM) {
                        canvasContext.beginPath();
                        canvasContext.rect(startpos.startX - 50, startpos.startY -50, 100, 100)
                        canvasContext.stroke()
                    }

                    else if (node.type === ENodeTypes.TERMINAL) {
                        canvasContext.beginPath();
                        canvasContext.moveTo(startpos.startX - 50, startpos.startY);
                        canvasContext.lineTo(startpos.startX, startpos.startY - 50);
                        canvasContext.lineTo(startpos.startX + 50, startpos.startY);
                        canvasContext.lineTo(startpos.startX, startpos.startY + 50);
                        canvasContext.lineTo(startpos.startX -50, startpos.startY);
                        canvasContext.stroke()
                    }

                    startpos.startX = startpos.startX + 175
                }

            }
        }
    }, [canvasNodes])

    return <canvas ref={canvasRef} {...props} />
}

export default NodeCanvas