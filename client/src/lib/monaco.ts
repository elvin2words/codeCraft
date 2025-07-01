// Monaco Editor configuration and utilities
export interface MonacoFile {
  id: number;
  name: string;
  path: string;
  content: string;
  language: string;
}

export function getLanguageFromFilename(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'py':
      return 'python';
    case 'java':
      return 'java';
    case 'cpp':
    case 'cc':
    case 'cxx':
      return 'cpp';
    case 'c':
      return 'c';
    case 'php':
      return 'php';
    case 'rb':
      return 'ruby';
    case 'go':
      return 'go';
    case 'rs':
      return 'rust';
    case 'sql':
      return 'sql';
    case 'sh':
    case 'bash':
      return 'shell';
    case 'xml':
      return 'xml';
    case 'yaml':
    case 'yml':
      return 'yaml';
    default:
      return 'plaintext';
  }
}

export function getFileIcon(filename: string, isFolder: boolean = false): string {
  if (isFolder) {
    return 'fas fa-folder';
  }
  
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'js':
    case 'jsx':
      return 'fab fa-js text-yellow-500';
    case 'ts':
    case 'tsx':
      return 'fas fa-code text-blue-500';
    case 'html':
      return 'fab fa-html5 text-orange-500';
    case 'css':
      return 'fab fa-css3-alt text-blue-500';
    case 'json':
      return 'fas fa-cog text-gray-500';
    case 'md':
      return 'fas fa-file-alt text-gray-500';
    case 'py':
      return 'fab fa-python text-green-500';
    case 'java':
      return 'fab fa-java text-red-500';
    case 'php':
      return 'fab fa-php text-purple-500';
    case 'rb':
      return 'fas fa-gem text-red-500';
    case 'go':
      return 'fas fa-code text-blue-400';
    case 'rs':
      return 'fas fa-cog text-orange-600';
    case 'sql':
      return 'fas fa-database text-blue-600';
    case 'xml':
      return 'fas fa-code text-green-600';
    case 'yaml':
    case 'yml':
      return 'fas fa-file-code text-purple-500';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return 'fas fa-image text-green-500';
    default:
      return 'fas fa-file text-gray-500';
  }
}
