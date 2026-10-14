import React from "react";
import { ToolItem } from "@/data/tools";
import { ToolTile } from "./ToolTile";

interface ToolCardProps {
  tool: ToolItem;
  onSelect: (tool: ToolItem) => void;
}

export function ToolCard({ tool, onSelect }: ToolCardProps) {
  return <ToolTile tool={tool} onSelect={onSelect} compact={false} />;
}
