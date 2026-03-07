"use client";
import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TemplateFileTree } from "@/features/playground/components/playground-explorer";
import { saveTemplateStructureToJson, TemplateFile } from "@/features/playground/libs/path-to-json";
import { useParams } from "next/navigation";
import { getPlaygroundById } from "@/features/playground/actions";
import { toast } from "sonner";
import { templatePaths } from "@/lib/template";
import ReactData from "@/output/React.json"
const MainPLaygroundPage = () => {
  const { id } = useParams();

  const [selectedFile, setSelectedFile] = useState<TemplateFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [PlaygroundData, setPlaygroundData] = useState(null);
  const [templateData , setTemplateData] = useState(null);

  const fetchPlaygroundTemplateData = async () => {
    try {
      setIsLoading(true);
      const data = await getPlaygroundById(id as string);
      // @ts-ignore
      setPlaygroundData(data);
      setIsLoading(false);
      toast.success("Playground loaded successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaygroundTemplateData();
  }, [id]);



  const handleFileSelect = (file: TemplateFile) => {
    setSelectedFile(file);
  };
  return (
    <>
      <TemplateFileTree
        data={ReactData!}
        onFileSelect={handleFileSelect}
        selectedFile={selectedFile!}
        title="Template Explorer"
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-col">
            <h1 className="text-sm font-medium">
              {selectedFile
                ? `${selectedFile.filename}.${selectedFile.fileExtension}`
                : "Select a file"}
            </h1>
            {selectedFile && (
              <p className="text-xs text-muted-foreground">
                {selectedFile.content.length} characters
              </p>
            )}
          </div>
        </header>
        <div className="p-4">
          {selectedFile ? (
            <pre className="rounded-md bg-muted p-4 overflow-auto max-h-[calc(100vh-8rem)]">
              <code>{selectedFile.content}</code>
            </pre>
          ) : (
            <div className="flex h-[calc(100vh-8rem)] items-center justify-center text-muted-foreground">
              Select a file from the sidebar to view its content
            </div>
          )}
        </div>
      </SidebarInset>
    </>
  );
};

export default MainPLaygroundPage;
