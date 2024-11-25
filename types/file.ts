// 基础文件接口
export interface BaseFileItem {
    id: string;
    name: string;
    type: "file" | "folder";
    parent_id: string | null;
    content?: string;
    created_at: string;
    updated_at: string;
    file_references?: string[];
    md5?: string;
  }

// 本地临时文件
export interface Tempfile extends BaseFileItem {
    isTemp?: boolean;
    isDirty?: boolean;
    lastSaved?: number;
    lastAutoSave?: string;
  }

// 已保存的文件
export interface FileItem extends BaseFileItem {
    isDirty?: boolean; // 添加 isDirty 属性以跟踪更改
    lastSaved?: number;
    lastAutoSave?: string;
}

type ValueOf<T> = T[keyof T];
export type FileEventType = ValueOf<typeof FILE_EVENTS>;

export interface FileEventDetail {
  file: Tempfile | FileItem;
  content?: string;
  previousId?: string; // 用于重命名/移动操作
}

// 文件事件接口
export interface FileEvent extends CustomEvent<FileEventDetail> {
  type: FileEventType;
}

// 修改接口定义
export interface FileContextType {
  createFile: (file: BaseFileItem & { id: string }) => Promise<FileItem>;
  updateFile: (file: BaseFileItem & { id: string }) => Promise<FileItem>;
  refreshFiles: () => Promise<BaseFileItem[]>;
  createTempFile: (
    parentId?: string | null
  ) => Promise<Tempfile>;
  createDirectory: (
    parentId: string,
    name: string
  ) => Promise<Tempfile>;
  saveFile: (
    fileId: string,
    content: string,
    newFileName: string,
    onComplete?: () => void
  ) => Promise<Tempfile>;
  updateFileContent: (fileId: string, content: string, file_references: string[]) => void;
  deleteFile: (fileId: string) => void;
  getFileContent: (fileId: string) => Promise<string | undefined>;
  hasUnsavedChanges: boolean;
  autoSaveInterval?: number;
  setAutoSaveInterval: (interval: number) => void;
  discardChanges: (fileId: string) => void;
  closeFile: (fileId: string) => void;
  selectFile: (file: FileItem | Tempfile) => void;
  openFiles: (FileItem | Tempfile)[]; // 添加打开的文件列表
  currentEditingFile: (FileItem | Tempfile) | null; // 添加当前编辑的文件
  setCurrentEditingFile: (file: (FileItem | Tempfile) | null) => void; // 添加设置当前编辑文件的方法
  updateFileReferences: (fileId: string, references: string[]) => Promise<void>;
  getFileReferences: (fileId: string) => Promise<string[]>;
}

// 创建文件变更事件
export const FILE_EVENTS = {
  CREATED: "FILE_CREATED",
  UPDATED: "FILE_UPDATED",
  DELETED: "FILE_DELETED",
  MOVED: "FILE_MOVED",
  RENAMED: "FILE_RENAMED",
  SELECTED: "FILE_SELECTED",
  CLOSED: "FILE_CLOSED",
  OPENED: "FILE_OPENED",
} as const;
