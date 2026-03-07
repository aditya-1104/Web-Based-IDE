"use client"

import * as React from "react"
import { ChevronRight, File, Folder } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar"

// Using the provided interfaces
interface TemplateFile {
  filename: string
  fileExtension: string
  content: string
}

/**
 * Represents a folder in the template structure which can contain files and other folders
 */
interface TemplateFolder {
  folderName: string
  items: (TemplateFile | TemplateFolder)[]
}

// Union type for items in the file system
type TemplateItem = TemplateFile | TemplateFolder

interface TemplateFileTreeProps {
  data: TemplateItem
  onFileSelect?: (file: TemplateFile) => void
  selectedFile?: TemplateFile
  title?: string
}

export function TemplateFileTree({
  data,
  onFileSelect,
  selectedFile,
  title = "Files Explorer",
}: TemplateFileTreeProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <TemplateNode item={data} onFileSelect={onFileSelect} selectedFile={selectedFile} level={0} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

interface TemplateNodeProps {
  item: TemplateItem
  onFileSelect?: (file: TemplateFile) => void
  selectedFile?: TemplateFile
  level: number
  path?: string
}

function TemplateNode({ item, onFileSelect, selectedFile, level, path = "" }: TemplateNodeProps) {
  // Check if the item is a folder by checking for the folderName property
  const isFolder = "folderName" in item

  // Default to open for first two levels
  const [isOpen, setIsOpen] = React.useState(level < 2)

  if (!isFolder) {
    // This is a file
    const file = item as TemplateFile
    const fileName = `${file.filename}.${file.fileExtension}`
    const currentPath = path ? `${path}/${fileName}` : fileName

    const isSelected =
      selectedFile && selectedFile.filename === file.filename && selectedFile.fileExtension === file.fileExtension

    return (
      <SidebarMenuItem>
        <SidebarMenuButton isActive={isSelected} onClick={() => onFileSelect?.(file)}>
          <File className="h-4 w-4 mr-2 shrink-0" />
          <span>{fileName}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  } else {
    // This is a folder
    const folder = item as TemplateFolder
    const folderName = folder.folderName
    const currentPath = path ? `${path}/${folderName}` : folderName

    return (
      <SidebarMenuItem>
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <ChevronRight className="transition-transform" />
              <Folder className="h-4 w-4 mr-2 shrink-0" />
              <span>{folderName}</span>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {folder.items.map((childItem, index) => (
                <TemplateNode
                  key={index}
                  item={childItem}
                  onFileSelect={onFileSelect}
                  selectedFile={selectedFile}
                  level={level + 1}
                  path={currentPath}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    )
  }
}
