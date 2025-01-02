import { useNotes } from "@/hooks/use-notes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pin, Sigma, Star } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function NoteStatsCard() {
  const { totalNotes, totalPinnedNotes, totalFavoriteNotes } = useNotes();
  const noteStats = [
    {
      icon: <Sigma className="w-4 h-4" />,
      label: "Total Notes",
      value: totalNotes,
      iconColor: "text-foreground/70",
      labelColor: "text-foreground/70",
      valueColor: "text-foreground/70",
    },
    {
      icon: <Pin className="text-blue-500 w-4 h-4" />,
      label: "Pinned Notes",
      value: totalPinnedNotes,
      iconColor: "text-blue-500",
      labelColor: "text-foreground/70",
      valueColor: "text-blue-500",
    },
    {
      icon: <Star className="text-yellow-500 w-4 h-4" />,
      label: "Favorite Notes",
      value: totalFavoriteNotes,
      iconColor: "text-yellow-500",
      labelColor: "text-foreground/70",
      valueColor: "text-yellow-500",
    },
  ];
  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <CardTitle>Notes Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pb-2 pt-2 gap-y-1 text-sm">
        <Table>
          <TableBody>
            {noteStats.map((noteStat, index) => (
              <TableRow key={index} className="border-none">
                <TableCell className="flex items-center gap-2">
                  <div className={noteStat.iconColor}>{noteStat.icon}</div>
                  <span className={`font-medium ${noteStat.labelColor}`}>
                    {noteStat.label}
                  </span>
                </TableCell>
                <TableCell
                  className={`text-right font-semibold ${noteStat.valueColor}`}
                >
                  {noteStat.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
