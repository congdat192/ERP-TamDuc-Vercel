import { useState, useCallback, useRef } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    Connection,
    Edge,
    Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { WorkflowSidebar } from './WorkflowSidebar';
import { WorkflowNode } from './WorkflowNode';

import { crmService } from '../../services/crmService';

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'custom',
        data: { label: 'Start Trigger', description: 'Khi có đơn hàng mới' },
        position: { x: 250, y: 5 },
    },
];

const nodeTypes = {
    custom: WorkflowNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

export function WorkflowBuilder() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

    // Load initial data
    useState(() => {
        const loadWorkflows = async () => {
            const workflows = await crmService.getWorkflows();
            if (workflows.length > 0) {
                const wf = workflows[0]; // Load first workflow for demo
                setNodes(wf.nodes);
                setEdges(wf.edges || []);
            }
        };
        loadWorkflows();
    });

    const onConnect = useCallback(
        (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            const label = event.dataTransfer.getData('application/label');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - (reactFlowWrapper.current?.getBoundingClientRect().left || 0),
                y: event.clientY - (reactFlowWrapper.current?.getBoundingClientRect().top || 0),
            });

            const newNode: Node = {
                id: getId(),
                type: 'custom',
                position,
                data: { label: `${label}`, description: 'Cấu hình chi tiết...' },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes]
    );

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            <ReactFlowProvider>
                <WorkflowSidebar />
                <div className="flex-1 h-full bg-gray-50" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <Controls />
                        <Background color="#aaa" gap={16} />
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
        </div>
    );
}
