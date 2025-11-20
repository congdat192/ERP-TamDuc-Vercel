import { memo } from 'react';
import { Handle, Position } from 'reactflow';

export const WorkflowNode = memo(({ data, isConnectable }: any) => {
    return (
        <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[150px]">
            <div className="flex items-center">
                <div className="rounded-full w-3 h-3 bg-gray-200 mr-2" />
                <div className="text-sm font-bold text-gray-700">{data.label}</div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{data.description}</div>

            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
                className="w-3 h-3 bg-blue-500"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
                className="w-3 h-3 bg-blue-500"
            />
        </div>
    );
});
