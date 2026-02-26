import { useState } from 'react';
import {
    ChevronRight,
    ChevronDown,
    Folder,
    FolderOpen,
    File,
    FileCode,
    FileText,
    Image,
} from 'lucide-react';
import { cn } from '@/utils';
import type { FileNode } from '@/types';

interface FileTreeNodeProps {
    node: FileNode;
    depth: number;
}

function getFileIcon(name: string) {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    if (['ts', 'tsx', 'js', 'jsx', 'py', 'go', 'rs', 'java', 'cpp', 'c'].includes(ext))
        return <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    if (['md', 'txt', 'json', 'yaml', 'yml', 'toml', 'env'].includes(ext))
        return <FileText className="w-3.5 h-3.5 text-yellow-400 shrink-0" />;
    if (['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp', 'ico'].includes(ext))
        return <Image className="w-3.5 h-3.5 text-pink-400 shrink-0" />;
    return <File className="w-3.5 h-3.5 text-muted-foreground shrink-0" />;
}

function FileTreeNode({ node, depth }: FileTreeNodeProps) {
    const [open, setOpen] = useState(depth < 2);
    const isFolder = node.type === 'folder';

    return (
        <div>
            <button
                type="button"
                onClick={() => isFolder && setOpen((o) => !o)}
                className={cn(
                    'flex items-center gap-1.5 w-full text-left py-0.5 px-2 rounded hover:bg-secondary/70 transition-colors group text-sm',
                    isFolder ? 'cursor-pointer' : 'cursor-default',
                )}
                style={{ paddingLeft: `${(depth + 1) * 12}px` }}
                aria-expanded={isFolder ? open : undefined}
            >
                {isFolder ? (
                    <>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                            {open ? (
                                <ChevronDown className="w-3 h-3 shrink-0" />
                            ) : (
                                <ChevronRight className="w-3 h-3 shrink-0" />
                            )}
                        </span>
                        {open ? (
                            <FolderOpen className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                        ) : (
                            <Folder className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                        )}
                    </>
                ) : (
                    <>
                        <span className="w-3 h-3 shrink-0" aria-hidden />
                        {getFileIcon(node.name)}
                    </>
                )}
                <span
                    className={cn(
                        'truncate text-xs',
                        isFolder ? 'text-foreground font-medium' : 'text-muted-foreground',
                        'group-hover:text-foreground transition-colors',
                    )}
                >
                    {node.name}
                </span>
            </button>

            {isFolder && open && node.children && node.children.length > 0 && (
                <div>
                    {node.children.map((child) => (
                        <FileTreeNode key={child.path} node={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

interface FileTreeProps {
    nodes: FileNode[];
}

export function FileTree({ nodes }: FileTreeProps) {
    return (
        <div className="select-none">
            {nodes.map((node) => (
                <FileTreeNode key={node.path} node={node} depth={0} />
            ))}
        </div>
    );
}
