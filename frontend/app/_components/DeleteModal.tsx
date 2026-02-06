interface DeleteModalProps {
  isOpen: null | boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur effect */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
      
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 to-black p-8 text-left shadow-2xl transition-all w-full max-w-md border border-gray-800">
          {/* Warning icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-900/20 mb-6">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.946-.833-2.714 0L4.196 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Content */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-3 tracking-tight">
              {title}
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed px-2">
              {description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3.5 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all duration-200 border border-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-6 py-3.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-200 shadow-lg hover:shadow-red-500/20 border border-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Delete
            </button>
          </div>

          {/* Close button (X) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}