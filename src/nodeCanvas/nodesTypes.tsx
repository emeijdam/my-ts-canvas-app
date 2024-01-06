enum ENodeTypes {
    SOURCE,
    TRANSFORM,
    TERMINAL
}

interface ICoordinates {
    x: number,
    y: number,
}

interface IPixelDimensions {
    width: number,
    height: number
}

interface IWorkbenchState {
    nodes: INewNode[],
    origin: ICoordinates
    canvasWidth: Number
    canvasHeight: Number
}

const diamondShapePath = (startX: number, startY: number) => {
    let path1 = new Path2D();
    path1.moveTo(startX - 50, startY)
    path1.lineTo(startX, startY - 50)
    path1.lineTo(startX + 50, startY)
    path1.lineTo(startX, startY + 50)
    path1.lineTo(startX - 50, startY)
    return path1
}

const rectPath = (startX: number, startY: number) => {
    let path1 = new Path2D();
    path1.rect(startX, startY, 100, 100)
    return path1
}

const circlePath = (startX: number, startY: number) => {
    let path1 = new Path2D();
    path1.arc(startX, startY, 50, 0, 2 * Math.PI)
    return path1
}

interface INode {
    name: string,
    type: ENodeTypes,
    centerPosition: ICoordinates,
    getShapePath2d: () => (Path2D)
}

abstract class NodeClass implements INode {
    centerPosition: { x: number, y: number }
    name: string
    abstract type: ENodeTypes

    constructor(name: string, centerPos: { x: number, y: number }) {
        this.name = name
        this.centerPosition = centerPos
    }

    abstract getShapePath2d(): Path2D
}

class sourceNode extends NodeClass {
    type = ENodeTypes.SOURCE

    getShapePath2d() {
        return circlePath(this.centerPosition.x, this.centerPosition.y)
    }
}

class transformNode extends NodeClass {
    type = ENodeTypes.TRANSFORM

    getShapePath2d() {
        return rectPath(this.centerPosition.x, this.centerPosition.y)
    }
}

class terminalNode extends NodeClass {
    type = ENodeTypes.TERMINAL

    getShapePath2d() {
        return diamondShapePath(this.centerPosition.x, this.centerPosition.y)
    }
}

interface INewNode {
    id: number
    name: string,
    type: ENodeTypes,
    centerPosition: ICoordinates,
    //ShapePath2d: Path2D
}



const getShapePath2d = (node: INewNode) => {
    switch (node.type) {
        case ENodeTypes.SOURCE: {
            return circlePath(node.centerPosition.x, node.centerPosition.y)
        }
        case ENodeTypes.TRANSFORM: {
            return diamondShapePath(node.centerPosition.x, node.centerPosition.y)
        }
        case ENodeTypes.TERMINAL: {
            return rectPath(node.centerPosition.x, node.centerPosition.y)
        }
    }
}


// gen position
const nextPosition = (doc: IWorkbenchState, newnodetype: ENodeTypes) => {
    // already there
    
    switch (newnodetype) {
        case ENodeTypes.SOURCE: {
            if (doc.nodes.length === 0){
                return {x: 100, y: 100}
            }
            // last source y + 100
            return {x: 100, y: 100}
        }
        case ENodeTypes.TRANSFORM: {
            return {x: 100, y: 100}
        }
        case ENodeTypes.TERMINAL: {
            return {x: 100, y: 100}
        }
    }
}

export { sourceNode, transformNode, terminalNode, type INode, NodeClass, type IWorkbenchState, ENodeTypes, type ICoordinates, type IPixelDimensions, circlePath, type INewNode, getShapePath2d , nextPosition}