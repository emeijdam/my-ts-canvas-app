import { useEffect, useRef, useState } from "react";

enum ENodeTypes {
    SOURCE,
    TRANSFORM,
    TERMINAL
}
interface INode {
    name: string,
    type: ENodeTypes,
}

interface NodeCanvasProps {
    width: number;
    height: number;
}

const testme = (x:number) => {x = x+10}

const diamondShapePath = (startX: number, startY: number) => {
    let path1 = new Path2D();
    path1.moveTo(startX - 50, startY)
    path1.lineTo(startX, startY - 50)
    path1.lineTo(startX + 50, startY)
    path1.lineTo(startX, startY + 50)
    path1.lineTo(startX -50, startY)
    return path1
}

const mySourceNode: INode = { name: 'input1', type: ENodeTypes.SOURCE }
const myTransformNode: INode = { name: 'input2', type: ENodeTypes.TRANSFORM }
const myTerminalNode: INode = { name: 'input3', type: ENodeTypes.TERMINAL }

const funOb = {
    x: 1,
    y: 2,
    getOwner: function () {
       return () => diamondShapePath(this.x, 10)
    }
}
const initState = [mySourceNode, myTransformNode, myTerminalNode]


const NodeCanvas = (props: NodeCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [canvasNodes, setCanvasNodes] = useState<INode[]>(initState)

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
                        //object
                        const path = diamondShapePath(startpos.startX, startpos.startY)
                        canvasContext.stroke(path)
                    }
                    startpos.startX = startpos.startX + 175
                }

            }
        }
    }, [canvasNodes])

    return <canvas ref={canvasRef} {...props} />
}

export default NodeCanvas