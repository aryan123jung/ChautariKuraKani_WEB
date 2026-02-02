"use client";

import CreateUserForm from "./CreateUserForm";

export default function CreateUserModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white w-full max-w-md rounded-md shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Create New User
          </h2>

          <CreateUserForm
            onCancel={onClose}
            onSuccess={() => {
              onSuccess();
              onClose();
            }}
          />
        </div>
      </div>
    </>
  );
}
