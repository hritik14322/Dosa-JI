import { useListUsers, useUpdateUserRole, useUpdateUserStatus, getListUsersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const roleBadge: Record<string, string> = {
  customer: "bg-blue-100 text-blue-700",
  shopkeeper: "bg-amber-100 text-amber-700",
  admin: "bg-red-100 text-red-700",
};

const ROLES = ["customer", "shopkeeper", "admin"] as const;
type Role = typeof ROLES[number];

export default function AdminUsers() {
  const { data: users, isLoading } = useListUsers();
  const updateRoleMutation = useUpdateUserRole();
  const updateStatusMutation = useUpdateUserStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleRoleChange = (id: number, role: Role) => {
    updateRoleMutation.mutate({ id, data: { role } }, {
      onSuccess: () => {
        toast({ title: "Role updated" });
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
      },
    });
  };

  const handleToggleStatus = (id: number, current: boolean) => {
    updateStatusMutation.mutate({ id, data: { isActive: !current } }, {
      onSuccess: () => {
        toast({ title: !current ? "User activated" : "User deactivated" });
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">User</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Role</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Joined</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${roleBadge[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.isActive ? (
                      <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
                        </svg>
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
                        </svg>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("en-CA")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* Cycle role */}
                      <div className="relative group">
                        <button
                          onClick={() => {
                            const idx = ROLES.indexOf(user.role as Role);
                            const next = ROLES[(idx + 1) % ROLES.length];
                            handleRoleChange(user.id, next);
                          }}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors"
                        >
                          Change Role
                        </button>
                      </div>
                      <button
                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                          user.isActive
                            ? "border border-red-200 text-red-500 hover:bg-red-50"
                            : "border border-green-200 text-green-600 hover:bg-green-50"
                        }`}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
