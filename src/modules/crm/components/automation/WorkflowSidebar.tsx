import { DragEvent } from 'react';

export function WorkflowSidebar() {
    const onDragStart = (event: DragEvent, nodeType: string, label: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col gap-4">
            <div className="font-bold text-lg mb-2">Công cụ</div>
            <div className="text-sm text-gray-500 mb-4">Kéo thả vào vùng làm việc</div>

            <div
                className="p-3 border border-blue-500 rounded cursor-grab bg-blue-50 hover:bg-blue-100 transition-colors"
                onDragStart={(event) => onDragStart(event, 'trigger', 'Trigger Event')}
                draggable
            >
                ⚡ Trigger (Sự kiện)
            </div>

            <div
                className="p-3 border border-green-500 rounded cursor-grab bg-green-50 hover:bg-green-100 transition-colors"
                onDragStart={(event) => onDragStart(event, 'action', 'Action')}
                draggable
            >
                ✅ Action (Hành động)
            </div>

            <div
                className="p-3 border border-orange-500 rounded cursor-grab bg-orange-50 hover:bg-orange-100 transition-colors"
                onDragStart={(event) => onDragStart(event, 'condition', 'Condition')}
                draggable
            >
                ❓ Condition (Điều kiện)
            </div>
        </aside>
    );
}
