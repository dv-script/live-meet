import { db } from "@/app/_lib/prisma";
import { AddNewUserDialog } from "./_components/_add-new-user/add-new-user-dialog";
import { UsersTable } from "./_components/_users-table/users-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LiveMeet | Dashboard - Usuários",
  description: "Gerencie todos os usuários da LiveMeet",
};

export default async function Page() {
  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      department: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="px-4 py-3 flex flex-col gap-5 max-w-screen-xl mx-auto">
      <div className="flex flex-col">
        <AddNewUserDialog />
        <UsersTable usersData={users} />
      </div>
    </div>
  );
}
