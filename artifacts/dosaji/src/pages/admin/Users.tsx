import { useListUsers, useUpdateUserRole, useUpdateUserStatus, getListUsersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsers() {
  const { data: users, isLoading } = useListUsers();
  const updateRoleMutation = useUpdateUserRole();
  const updateStatusMutation = useUpdateUserStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleRoleChange = (id: number, role: any) => {
    updateRoleMutation.mutate({ id, data: { role } }, {
      onSuccess: () => {
        toast({ title: "Role updated", description: "User role updated successfully." });
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
      }
    });
  };

  const handleStatusChange = (id: number, isActive: boolean) => {
    updateStatusMutation.mutate({ id, data: { isActive } }, {
      onSuccess: () => {
        toast({ title: "Status updated", description: "User status updated successfully." });
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
      }
    });
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-serif mb-8">Manage Users</h1>
      
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold w-40">Role</th>
                <th className="p-4 font-semibold text-center w-32">Active</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-muted-foreground">{user.email}</td>
                  <td className="p-4">
                    <Select 
                      value={user.role} 
                      onValueChange={(v) => handleRoleChange(user.id, v)}
                    >
                      <SelectTrigger className="w-full h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="shopkeeper">Shopkeeper</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4 text-center">
                    <Switch 
                      checked={user.isActive} 
                      onCheckedChange={(c) => handleStatusChange(user.id, c)}
                    />
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
