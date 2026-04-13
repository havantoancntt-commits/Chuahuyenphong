import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-amber-200 p-8 text-center font-serif">
          <h2 className="text-2xl mb-4 uppercase tracking-widest">Đã có lỗi xảy ra</h2>
          <p className="text-sm opacity-60 mb-8 max-w-md">
            Không gian tâm linh đang gặp sự cố kỹ thuật. Vui lòng làm mới trang hoặc thử lại sau.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 border border-amber-500/50 rounded-full hover:bg-amber-500/10 transition-all uppercase text-xs tracking-widest"
          >
            Tải lại trang
          </button>
          {process.env.NODE_ENV !== 'production' && (
            <pre className="mt-8 p-4 bg-red-900/20 rounded text-left text-xs overflow-auto max-w-full">
              {this.state.error?.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
