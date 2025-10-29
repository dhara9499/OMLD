import React, { useState, useEffect } from 'react';
import Button1 from '../../components/UiElements/Button1';

interface FlatCategory {
    id: number;
    parent_id: number;
    level: number;
    name: string;
}

interface TreeCategory extends FlatCategory {
    children: TreeCategory[];
}

interface Props {
    data: FlatCategory[];
    selectedCategories: any[];
    setSelectedCategories;
}

const CategoryTree: React.FC<Props> = ({ data, selectedCategories, setSelectedCategories
}) => {
    const [tree, setTree] = useState<TreeCategory[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const [expanded, setExpanded] = useState<number[]>([]);
    const [categories, setCategories] = useState<number[]>([]);;

    useEffect(() => {
        console.log(selected);
        setSelectedCategories(selected);
    }, [selected]);

    const buildTree = (flat: FlatCategory[]): TreeCategory[] => {
        const map: { [key: number]: TreeCategory } = {};
        const roots: TreeCategory[] = [];

        flat.forEach((cat) => {
            map[cat.id] = { ...cat, children: [] };
        });

        flat.forEach((cat) => {
            if (cat.parent_id === 0) {
                roots.push(map[cat.id]);
            } else if (map[cat.parent_id]) {
                map[cat.parent_id].children.push(map[cat.id]);
            }
        });

        return roots;
    };

    useEffect(() => {
        setTree(buildTree(data));
    }, [data]);

    const isExpanded = (id: number) => expanded.includes(id);
    const toggleExpand = (id: number) => {
        setExpanded((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const isSelected = (id: number) => selected.includes(id);

    const getAllDescendantIds = (node: TreeCategory): number[] => {
        let ids: number[] = [node.id];
        node.children.forEach((child) => {
            ids = ids.concat(getAllDescendantIds(child));
        });
        setCategories(ids);
        return ids;
    };

    const handleCheckboxChange = (node: TreeCategory, checked: boolean) => {
        const ids = getAllDescendantIds(node);
        setSelected((prev) => {
            if (checked) {
                return Array.from(new Set([...prev, ...ids]));
            } else {
                return prev.filter((id) => !ids.includes(id));
            }
        });

    };

    const renderTree = (nodes: TreeCategory[]) => {
        if (!Array.isArray(nodes)) return null;

        return (
            <ul className="ml-2">
                {nodes.map((node) => {
                    const hasChildren = node.children.length > 0;
                    const expandedState = isExpanded(node.id);

                    return (
                        <li key={node.id} className="mb-1">
                            <div
                                className="flex items-center"
                                style={{ marginLeft: `${node.level * 1.5}rem` }}
                            >
                                {hasChildren && (
                                    <button
                                        className="mr-2 text-gray-500 hover:text-gray-700"
                                        onClick={() => toggleExpand(node.id)}
                                    >
                                        {expandedState ? '−' : '+'}
                                    </button>
                                )}
                                <input
                                    type="checkbox"
                                    checked={isSelected(node.id)}
                                    onChange={(e) =>
                                        handleCheckboxChange(node, e.target.checked)
                                    }
                                    className="mr-2"
                                />
                                <span className="text-gray-800 dark:text-white whitespace-pre">
                                    {node.name.trim()}
                                </span>
                            </div>
                            {hasChildren && expandedState && renderTree(node.children)}
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Category Tree</h2>
            {renderTree(tree)}
        </div>
    );
};

export default CategoryTree;