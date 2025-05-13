// 实现一个Alter组件，用于在页面做一些悬浮信息提示

interface AlterProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message?: string;
}

const Alter: React.FC<AlterProps> = () => {
  // const { type, title, message } = props;
  return (
    <div role="alert" className="alert fixed top-5 right-5 z-50 flex items-center w-full max-w-xs p-4 text-gray-500 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
      <div className="flex items-center justify-center w-8 h-8 mr-3 text-blue-500 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M12 4a8 8 0 100 16 8 8 0 000-16z"></path>
        </svg>
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-white">信息提示</span>
      <button type="button" className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-100 inline-flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:bg-blue-800 dark:hover:text-white" data-dismiss-target="#alert-additional-content-2" aria-label="Close">
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l14 12M15 1L1 13"></path>
        </svg>
      </button>
    </div>
  );
}

export default Alter;