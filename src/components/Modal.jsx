import React from "react";

export const Modal = ({
  children,
  show = false,
  icon,
  title = "",
  description = "",
  onAccept = () => {},
  onCancel = () => {},
  acceptText = "Aceptar",
  cancelText = "Cancelar",
  hideAccept = false,
  hideCancel = false,
}) => {
  return (
    <>
      <div
        className={`relative z-10 transition-opacity duration-300  ${
          show
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        aria-hidden={!show}
      >
        <div
          className="fixed inset-0 bg-white/25 transition-opacity"
          aria-hidden={!show}
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="">
                  {(title || description || children) && (
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      {title && (
                        <h3
                          className="text-base text-center font-semibold text-gray-900"
                          id="modal-title"
                        >
                          {title}
                        </h3>
                      )}
                      {description && (
                        <div className="mt-2">
                          <p className="text-sm text-center text-gray-500">
                            {description}
                          </p>
                        </div>
                      )}
                      {children}
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                {!hideAccept && (
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-sky-500 sm:ml-3 sm:w-auto"
                    onClick={onAccept}
                  >
                    {acceptText}
                  </button>
                )}
                {!hideCancel && (
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onCancel}
                  >
                    {cancelText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
