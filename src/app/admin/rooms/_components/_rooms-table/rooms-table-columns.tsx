import { Button } from "@/app/_components/ui/button";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { formatDate } from "@/app/_utils/format-date";
import { Location, Room } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Popover, PopoverContent } from "@/app/_components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { getLocationName } from "@/app/_utils/locations";
import { EditRoomDialog } from "../_edit-room/edit-room-dialog";
import { DeleteRoomDialog } from "../_delete-room/delete-room-dialog";

export const roomsTableColumns: ColumnDef<Room>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          <span>Nome</span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown size={12} />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <div className="whitespace-nowrap">{name}</div>;
    },
  },
  {
    accessorKey: "capacity",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          <span>Capacidade</span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown size={12} />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const capacity = row.getValue("capacity") as number;

      return <div>{capacity.toString() + " " + "pessoas"}</div>;
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          <span className="whitespace-nowrap">Localização</span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown size={12} />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const location = row.getValue("location") as Location;
      const locationName = getLocationName(location);

      return <div>{locationName}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          <span className="whitespace-nowrap">Criado em</span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown size={12} />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const createdAtDate = row.getValue("createdAt") as Date;

      return <div className="lowercase">{formatDate(createdAtDate)}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          <span className="whitespace-nowrap">Atualizado em</span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown size={12} />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const updatedAtDate = row.getValue("updatedAt") as Date;

      return <div className="lowercase">{formatDate(updatedAtDate)}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,

    cell: ({ row }) => {
      const room = row.original as Room;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon-xs">
              <MoreHorizontal size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-1 flex flex-col gap-1">
            <EditRoomDialog room={room} />
            <DeleteRoomDialog room={room} />
          </PopoverContent>
        </Popover>
      );
    },
  },
];
